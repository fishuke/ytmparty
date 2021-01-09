import * as io from 'socket.io-client';

class Background {

  isInParty: boolean;
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
            case 'createParty':
              this.createParty();
              break;
            case 'joinParty':
              break;
            case 'play':
              break;
            case 'pause':
              break;
            case 'seeked':
              break;
            case 'nextTrack':
              const trackUrl = request.url;
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
      this.isInParty = true;
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

  createParty(): void {
    this.socket.emit('createRoom');
  }

  joinParty(roomID: string): void {
    this.socket.emit('joinRoom', roomID);
  }

}

// tslint:disable-next-line:no-unused-expression
new Background();
