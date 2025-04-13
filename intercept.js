function loadInspectData() {
    chrome.storage.local.get(['url', 'domain'], function (result) {
      const { url, domain } = result;
  
      document.getElementById('loading').style.display = 'none';
      document.getElementById('content').style.display = 'flex';
  
      document.getElementById('yes').addEventListener('click', () => {
        chrome.storage.local.get(['bypassDomains'], function (data) {
          const bypassList = data.bypassDomains || [];
          if (!bypassList.includes(domain)) {
            bypassList.push(domain);
          }
  
          chrome.storage.local.set({ bypassDomains: bypassList }, () => {
            if (url) {
              window.location.href = url;
            }
          });
        });
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', loadInspectData);
  