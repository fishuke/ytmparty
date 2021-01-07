import * as io from 'socket.io-client';
import {environment} from './environments/environment';

class Background {
  isInParty: boolean;
  socket;

  checkYtmTab: Promise<boolean> = new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0].url.includes('https://music.youtube.com')) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

  constructor() {
    this.socket = io(environment.socket);
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.listenMessages();
  }

  listenMessages(): void {
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        console.log(request);
      });
  }

}

// tslint:disable-next-line:no-unused-expression
new Background();
