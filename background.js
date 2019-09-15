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
        console.log('there is a storage key');
        updatedNote = result.storageKey + '\n' + note;
        console.log('updateNote')
      } else {
        updatedNote = note;
      }

      chrome.storage.local.set({ [storageKey]: updatedNote }, () => {
        console.log('@@@ stored to local storage: @@@');
        console.log('@@@ key: @@@');
        console.log(storageKey);
        console.log('@@@ value: @@@');
        console.log(updatedNote);
        
        chrome.notifications.create({
          type: 'basic',
          iconUrl: './images/389cd119.png',
          title: 'Note Buddy',          
          message: 'Successfully saved note ✿',
        }, () => {
          console.log('@@@ created notification @@@');
          
          console.log('$$$ creating alarm now $$$')
          chrome.alarms.create(
            'notificationClearAlarm',  
            { when: Date.now() + 1400 }
          );
        });
      });
    });
  });
});

chrome.alarms.onAlarm.addListener(() => {
  console.log('@@@ in onAlarm listener @@@');
  
  chrome.notifications.getAll(notifications => {
    console.log('@@@ notifications: @@@');
    console.log(notifications);

    for (let id in notifications) {
      chrome.notifications.clear(id, (wasCleared) => {
        console.log(`@@@ notification was cleared: ${wasCleared} @@@`)
      });
    }
  });
});
