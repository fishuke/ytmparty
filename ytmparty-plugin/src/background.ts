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
              this.socket.emit('seeked');
              break;
            case 'nextTrack':
              this.socket.emit('nextTrack', {url: request.url, duration: request.duration});

              break;
            case 'advertisement':
              break;
          }
        }
        sendResponse(true);

      });
  }

  listenSocketEvents(): void {
    this.socket.on('joinedRoom', (message) => {
      console.log({joinedRoom: message});
      chrome.runtime.sendMessage({event: 'joinedRoom', code: message});
      this.isInParty = true;
      this.partyCode = message;
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
    this.socket = io('ws://localhost:3000');
    this.socket.on('connect', () => {
      console.log('Client connected');
      this.listenSocketEvents();
    });
  }


}

// tslint:disable-next-line:no-unused-expression
new Background();
