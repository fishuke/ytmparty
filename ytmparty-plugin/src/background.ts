
class Background {
  isInParty: boolean;
  checkYtmTab: Promise<boolean> = new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0].url.includes('https://music.youtube.com')) {
        reject('Youtube music tab not found.');
      } else {
        resolve(true);
      }
    });
  });

  constructor() {
    this.listenMessages();
  }

  listenMessages(): void {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      console.log('Received %o from %o, frame', msg, sender.tab, sender.frameId);
      sendResponse('Gotcha!');
    });
  }

}

// tslint:disable-next-line:no-unused-expression
new Background();
