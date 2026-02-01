// LeadSnipe - Cold Email Extraction Tool by Sahinur
const api = window.browser || window.chrome;

// Personal email domains to filter
const personalDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'gmx.com', 'live.com', 'msn.com', 'me.com', 'inbox.com', 'fastmail.com',
  'yahoo.co.uk', 'yahoo.co.in', 'hotmail.co.uk', 'googlemail.com',
  'rediffmail.com', 'qq.com', '163.com', '126.com', 'sina.com'
];

let allEmails = [];
let filteredEmails = [];
let currentFilter = 'all';

// Extract button click
document.getElementById('extractBtn').addEventListener('click', async () => {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });

  if (chrome.scripting) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractEmailsFromPage
    }, (results) => {
      if (results && results[0] && results[0].result) {
        processEmails(results[0].result);
      }
    });
  } else {
    api.tabs.executeScript(tab.id, {
      code: `(${extractEmailsFromPage.toString()})()`
    }, (results) => {
      if (results && results[0]) {
        processEmails(results[0]);
      }
    });
  }
});

function extractEmailsFromPage() {
  const input = document.documentElement.outerText;
  const emailsFound = input.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z._-]+[a-zA-Z])/gi
  );

  if (!emailsFound) return [];

  // Remove duplicates, lowercase, and sort
  const uniqueEmails = [...new Set(emailsFound.map(e => e.toLowerCase()))].sort();
  return uniqueEmails;
}

function processEmails(emails) {
  allEmails = emails.map(email => {
    const domain = email.split('@')[1];
    const isPersonal = personalDomains.includes(domain.toLowerCase());
    return {
      email: email,
      domain: domain,
      type: isPersonal ? 'personal' : 'business'
    };
  });

  updateStats();
  applyFilter(currentFilter);
  enableButtons();
  showDomainStats();

  // Auto-copy all emails
  if (allEmails.length > 0) {
    copyToClipboard(allEmails.map(e => e.email).join('\n'));
    showToast('Extracted & Copied ' + allEmails.length + ' emails!');
  }
}

function updateStats() {
  const total = allEmails.length;
  const business = allEmails.filter(e => e.type === 'business').length;
  const personal = allEmails.filter(e => e.type === 'personal').length;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('businessCount').textContent = business;
  document.getElementById('personalCount').textContent = personal;
}

function showDomainStats() {
  const domainCounts = {};
  allEmails.forEach(e => {
    domainCounts[e.domain] = (domainCounts[e.domain] || 0) + 1;
  });

  const sorted = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length > 0) {
    const html = sorted.map(([domain, count]) =>
      `<div class="domain-item">
        <span class="domain-name">@${domain}</span>
        <span class="domain-count">${count} emails</span>
      </div>`
    ).join('');

    document.getElementById('domainStats').innerHTML = '<strong style="font-size:11px;color:#888;">Top Domains:</strong>' + html;
    document.getElementById('domainStats').style.display = 'block';
  }
}

function applyFilter(filter) {
  currentFilter = filter;

  if (filter === 'all') {
    filteredEmails = allEmails;
  } else if (filter === 'business') {
    filteredEmails = allEmails.filter(e => e.type === 'business');
  } else if (filter === 'personal') {
    filteredEmails = allEmails.filter(e => e.type === 'personal');
  }

  displayEmails();
}

function displayEmails() {
  const emailList = document.getElementById('emailList');

  if (filteredEmails.length === 0) {
    emailList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div>No emails found</div>
      </div>`;
    return;
  }

  emailList.innerHTML = filteredEmails.map(item => `
    <div class="email-item ${item.type}">
      <span class="email-text">${item.email}</span>
      <button class="email-copy" data-email="${item.email}" title="Copy">📋</button>
    </div>
  `).join('');

  // Add click handlers for individual copy buttons
  document.querySelectorAll('.email-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.target.dataset.email;
      copyToClipboard(email);
      showToast('Copied: ' + email);
    });
  });
}

function enableButtons() {
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('exportCsv').disabled = false;
  document.getElementById('exportTxt').disabled = false;
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    applyFilter(e.target.dataset.filter);
  });
});

// Copy all button
document.getElementById('copyBtn').addEventListener('click', () => {
  const emails = filteredEmails.map(e => e.email).join('\n');
  copyToClipboard(emails);
  showToast('Copied ' + filteredEmails.length + ' emails!');
});

// Export CSV
document.getElementById('exportCsv').addEventListener('click', () => {
  const csv = 'Email,Domain,Type\n' +
    filteredEmails.map(e => `${e.email},${e.domain},${e.type}`).join('\n');
  downloadFile(csv, 'emails.csv', 'text/csv');
  showToast('Exported CSV!');
});

// Export TXT
document.getElementById('exportTxt').addEventListener('click', () => {
  const txt = filteredEmails.map(e => e.email).join('\n');
  downloadFile(txt, 'emails.txt', 'text/plain');
  showToast('Exported TXT!');
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}
