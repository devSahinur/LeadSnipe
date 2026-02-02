// LeadSnipe - Cold Email Extraction Tool by Sahinur (Firefox Version)

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
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  browser.tabs.executeScript(tab.id, {
    code: `(function() {
      const input = document.documentElement.outerText;
      const emailsFound = input.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z._-]+[a-zA-Z])/gi);
      if (!emailsFound) return [];
      const uniqueEmails = [...new Set(emailsFound.map(e => e.toLowerCase()))].sort();
      return uniqueEmails;
    })()`
  }).then((results) => {
    if (results && results[0]) {
      processEmails(results[0]);
    }
  });
});

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

  const domainStatsEl = document.getElementById('domainStats');

  if (sorted.length > 0) {
    // Clear existing content safely
    while (domainStatsEl.firstChild) {
      domainStatsEl.removeChild(domainStatsEl.firstChild);
    }

    const title = document.createElement('strong');
    title.style.fontSize = '11px';
    title.style.color = '#888';
    title.textContent = 'Top Domains:';
    domainStatsEl.appendChild(title);

    sorted.forEach(([domain, count]) => {
      const item = document.createElement('div');
      item.className = 'domain-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'domain-name';
      nameSpan.textContent = '@' + domain;

      const countSpan = document.createElement('span');
      countSpan.className = 'domain-count';
      countSpan.textContent = count + ' emails';

      item.appendChild(nameSpan);
      item.appendChild(countSpan);
      domainStatsEl.appendChild(item);
    });

    domainStatsEl.style.display = 'block';
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

  // Clear existing content safely
  while (emailList.firstChild) {
    emailList.removeChild(emailList.firstChild);
  }

  if (filteredEmails.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';

    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.textContent = '📭';

    const text = document.createElement('div');
    text.textContent = 'No emails found';

    emptyState.appendChild(icon);
    emptyState.appendChild(text);
    emailList.appendChild(emptyState);
    return;
  }

  filteredEmails.forEach(item => {
    const emailItem = document.createElement('div');
    emailItem.className = 'email-item ' + item.type;

    const emailText = document.createElement('span');
    emailText.className = 'email-text';
    emailText.textContent = item.email;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'email-copy';
    copyBtn.textContent = '📋';
    copyBtn.title = 'Copy';
    copyBtn.addEventListener('click', () => {
      copyToClipboard(item.email);
      showToast('Copied: ' + item.email);
    });

    emailItem.appendChild(emailText);
    emailItem.appendChild(copyBtn);
    emailList.appendChild(emailItem);
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
    filteredEmails.map(e => e.email + ',' + e.domain + ',' + e.type).join('\n');
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
