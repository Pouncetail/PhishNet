document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.getElementById('toggleExtension')
  const statusText = document.getElementById("extension_status")



  chrome.storage.sync.get(["extensionEnabled"], (result) => {
    const isEnabled = result.extensionEnabled ?? true; // default to true
    toggle.checked = isEnabled;
    statusText.textContent = isEnabled ? "You are protected!" : "You are not protected!";
  });

  chrome.storage.sync.get(['urlList'], function (result) {
    let currentList = result.urlList
    console.log(result.urlList)
    if (currentList == []) {
      return;
    }else{
      const ul = document.getElementById('urlList');
      ul.innerHTML = '';
      let li;
      for(let i = 0; i < currentList.length; i++){
        li = document.createElement('li');
        li.innerHTML = `${currentList[i]} <button class="delete-btn">&times;</button>`;


        // Delete on click
        li.querySelector('.delete-btn').addEventListener('click', () => {

          const textToDelete = li.firstChild.textContent.trim();
          chrome.storage.sync.get(['urlList'], (result) => {
            let list = result.urlList || [];
        
            // Filter out the item you want to remove
            list = list.filter(item => item !== textToDelete);
        
            // Save updated list back to storage
            chrome.storage.sync.set({ urlList: list });
          });
          li.remove();
        });

        ul.appendChild(li);
      }
    }
  });
});

document.querySelector('.switch input').addEventListener('change', function () {
  const isEnabled = this.checked;

  chrome.storage.sync.set({ extensionEnabled: isEnabled });

  const status = isEnabled ? 'You are protected!' : 'You are not protected!';
  document.getElementById('extension_status').textContent = status;
});


document.getElementById('addBtn').addEventListener('click', () => {
  const url = prompt("Enter a new item:");
  if (url) {
    addListItem(url);
  }
});


function addListItem(text) {
  chrome.storage.sync.get(['urlList'], function (result) {
    let currentList = result.urlList || [];
    if (currentList.includes(text)) {
      alert('Item already exists!');
      return;
    }
    currentList.push(text);
    chrome.storage.sync.set({ urlList: currentList });
  });
  const ul = document.getElementById('urlList');
  const li = document.createElement('li');
  li.innerHTML = `${text} <button class="delete-btn">&times;</button>`;


  // Delete on click
  li.querySelector('.delete-btn').addEventListener('click', () => {
    const textToDelete = li.firstChild.textContent.trim();
          chrome.storage.sync.get(['urlList'], (result) => {
            let list = result.urlList || [];
        
            // Filter out the item you want to remove
            list = list.filter(item => item !== textToDelete);
        
            // Save updated list back to storage
            chrome.storage.sync.set({ urlList: list });
          });
          li.remove();
    li.remove();
  });

  ul.appendChild(li);

  
}

fetch('https://example.com/api/check-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // Add 'Authorization' or other headers if your API requires it
    },
    body: JSON.stringify({ url: "https://some-link.com" })
  })
    .then(res => res.json())
    .then(data => {
      console.log("API response:", data);
      chrome.storage.sync.get(null, console.log);

      // use the data (e.g., display safe/unsafe message)
    })
    .catch(err => {
      console.error("API call error:", err);
      chrome.storage.sync.get(null, console.log);

    });


