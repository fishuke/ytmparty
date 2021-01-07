
class Background {
  isInParty: boolean;

  constructor() {
    this.listenMessages();
  }

  listenMessages(): void {
    chrome.runtime.onMessage.addListener((request, callback) => {
      console.log(request);
    });
  }

}

// tslint:disable-next-line:no-unused-expression
new Background();
