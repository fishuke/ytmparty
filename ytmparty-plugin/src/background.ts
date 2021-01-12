import * as io from 'socket.io-client';

class Background {

  isInParty = false;
  partyCode;
  socket;

  constructor() {
    this.connectToWebsocket();
    this.listenMessages();
  }

  listenMessages(): void {
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request) {
          switch (request.event) {
            case 'isInParty':
              sendResponse(this.isInParty);
              break;
            case 'getPartyCode':
              sendResponse(this.partyCode);
              break;
            case 'createParty':
              this.socket.emit('createRoom');
              break;
            case 'joinParty':
              this.socket.emit('joinRoom', request.code);
              break;
            case 'leaveParty':
              this.socket.emit('leaveRoom');
              this.isInParty = false;
              this.partyCode = null;
              break;
            case 'play':
              this.socket.emit('play');
              break;
            case 'pause':
              this.socket.emit('pause');
              break;
            case 'seeked':
              this.socket.emit('seeked', request.to);
              break;
            case 'nextTrack':
              this.socket.emit('seeked', 0);
              this.socket.emit('nextTrack', {url: request.url, duration: request.duration});
              break;
            case 'advertisement':
              this.socket.emit('advertisement');
              break;
          }
        }
        sendResponse(true);

      });
  }

  listenSocketEvents(): void {
    this.socket.on('joinedRoom', (message) => {
      console.log({joinedRoom: message});
      chrome.tabs.query({url: 'https://music.youtube.com/*'}, tabs => {
        if (tabs.length !== 0) {
          chrome.tabs.sendMessage(tabs[0].id, {event: 'joinedRoom', code: message});
        }
      });
      this.isInParty = true;
      this.partyCode = message;
    });

    this.socket.on('nextTrack', (data) => {
      console.log({nextTrack: data});
      chrome.tabs.query({url: 'https://music.youtube.com/*'}, tabs => {
        if (tabs.length !== 0) {
          chrome.tabs.sendMessage(tabs[0].id, {event: 'nextTrack', url: data.url, duration: data.duration});
        }
      });
    });

    this.socket.on('play', () => {
      console.log('play');
      chrome.tabs.query({url: 'https://music.youtube.com/*'}, tabs => {
        if (tabs.length !== 0) {
          chrome.tabs.sendMessage(tabs[0].id, {event: 'play'});
        }
      });
    });

    this.socket.on('pause', () => {
      console.log('pause');
      chrome.tabs.query({url: 'https://music.youtube.com/*'}, tabs => {
        if (tabs.length !== 0) {
          chrome.tabs.sendMessage(tabs[0].id, {event: 'pause'});
        }
      });
    });

    this.socket.on('seeked', (to) => {
      console.log({seeked: to});
      chrome.tabs.query({url: 'https://music.youtube.com/*'}, tabs => {
        if (tabs.length !== 0) {
          chrome.tabs.sendMessage(tabs[0].id, {event: 'seeked', to});
        }
      });
    });

    this.socket.on('advertisement', () => {
      console.log('advertisement');
      chrome.tabs.query({url: 'https://music.youtube.com/*'}, tabs => {
        if (tabs.length !== 0) {
          chrome.tabs.sendMessage(tabs[0].id, {event: 'advertisement'});
        }
      });
    });

    this.socket.on('error', (message) => {
      console.log({error: message});
      chrome.runtime.sendMessage({event: 'error', error: message});
      this.isInParty = false;
      this.partyCode = null;
    });
  }

  connectToWebsocket(): void {
    // @ts-ignore
    this.socket = io('wss://ytmparty.herokuapp.com');
    this.socket.on('connect', () => {
      console.log('Client connected');
      this.listenSocketEvents();
    });
  }


}

// tslint:disable-next-line:no-unused-expression
new Background();
