
class Background {
  isInParty: boolean;

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
