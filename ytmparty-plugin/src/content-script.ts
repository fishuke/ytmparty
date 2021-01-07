import * as io from 'socket.io-client';
import {environment} from './environments/environment';


class ContentScript {
  video;
  socket;

  constructor() {
    this.socket = io(environment.socket);
    this.socket.on('connect', () => {
      console.log('connected');
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log({request});
      if (request.msg) {
        sendResponse({msg: 'response'});
        return true;
      }
    });

    this.addEventListeners();
  }


  /**
   * @param element video element
   * @param fn returning listeners
   * @param listeners can be following variables
   * abort canplay canplaythrough durationchange emptied encrypted ended error interruptbegin
   * loadeddata loadedmetadata loadstart mozaudioavailable pause interruptend play playing
   * progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting
   */
  addMultiListeners(element, listeners, fn): void {
    listeners.split(' ').forEach(e => element.addEventListener(e, fn, false));
  }

  addEventListeners(): void {
    this.addMultiListeners(this.video, 'pause play seeking seeked loadedmetadata', (e) => {
      if (e.type === 'pause') {
        chrome.runtime.sendMessage({event: 'pause'}, response => {
          console.log('Response: ', response);
        });
        console.log('pause');
      } else if (e.type === 'play') {
        this.socket.emit('message', 'play');
        console.log('play');
      } else if (e.type === 'seeking') {
        this.socket.emit('message', 'play');
        console.log({'seeking to': e.timeStamp});
      } else if (e.type === 'seeked') {
        this.socket.emit('message', 'play');
        console.log({'seeked to': e.timeStamp});
      } else if (e.type === 'loadedmetadata') {
        // @ts-ignore
        if (navigator.mediaSession.metadata.artwork[0].src.includes('https://i.ytimg.com/')) {
          this.socket.emit('message', 'advertisement');
          console.log('advertisement');
        } else {
          this.socket.emit('message', {
            // tslint:disable-next-line
            'next track': navigator.mediaSession.metadata,
            url: window.location.href.split('&')[0]
          });
          // tslint:disable-next-line
          console.log({'next track': navigator['mediaSession'].metadata, url: window.location.href.split('&')[0]});
        }
      }
    });
  }

  findVideoQuery(): void {
    const myInterval = setInterval(() => {
      this.video = document.querySelector('video');
      if (this.video) {
        this.addEventListeners();
        clearInterval(myInterval);
      }
    }, 1000);
  }

}

// tslint:disable-next-line:no-unused-expression
new ContentScript();

