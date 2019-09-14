chrome.runtime.onInstalled.addListener(() => {
  
  chrome.contextMenus.create({
    id: 'randomID',
    contexts: ['selection'],
    title: 'save note ฅ^•ﻌ•^ฅ',
  }, () => {
    console.log('@@@ "save note" context menu item created @@@');
  });

});

chrome.contextMenus.onClicked.addListener(info => {
  console.log('@@@ context menu clicked @@@');
  const note = info.selectionText;

  chrome.identity.getProfileUserInfo(userInfo => {
    console.log('@@@ grabbed profile user @@@');
    const email = userInfo.email;
    const storageKey = email + ':notebuddy';

    chrome.storage.local.get([storageKey], result => {
      let updatedNote;
      if (result.storageKey) {
        updatedNote = result.storageKey + '\n' + note;
      } else {
        updatedNote = note;
      }

      chrome.storage.local.set({ [storageKey]: updatedNote }, () => {
        console.log('@@@ stored to local storage: @@@');
        console.log('@@@ key: @@@');
        console.log(storageKey);
        console.log('@@@ value: @@@');
        console.log(note);
      });
    });
  });
});