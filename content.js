// Content script for Firefox compatibility
// Listens for messages from popup to extract emails

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractEmails') {
    const emails = extractEmails();
    sendResponse({ emails: emails });
  }
  return true;
});

function extractEmails() {
  const input = document.documentElement.outerText.toLowerCase();
  const emailsFound = input.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z._-]+[a-zA-Z])/gi
  );

  if (!emailsFound) {
    return [];
  }

  // Remove duplicates and sort
  const uniqueEmails = [...new Set(emailsFound)].sort();
  return uniqueEmails;
}
