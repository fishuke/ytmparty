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

  }

  addMultiListeners(element, listeners, fn): void {
    listeners.split(' ').forEach(e => element.addEventListener(e, fn, false));
  }

  addEventListeners(): void {
    /**
     * listeners abort canplay canplaythrough durationchange emptied encrypted ended error interruptbegin interruptend play playing
     * loadeddata loadedmetadata loadstart mozaudioavailable pause
     * progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting
     */
    this.addMultiListeners(this.video, 'pause play seeking seeked loadedmetadata', (e) => {
      if (e.type === 'pause') {
        this.socket.emit('message', 'pause');
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
          // tslint:disable-next-line
          this.socket.emit('message', {
            'next track': navigator['mediaSession'].metadata,
            url: window.location.href.split('&')[0]
          });
          // tslint:disable-next-line
          console.log({'next track': navigator['mediaSession'].metadata, url: window.location.href.split('&')[0]});
        }
      }
    });
  }

  findVideoQuery(){
    const myInterval = setInterval(() => {
      this.video = document.querySelector('video');
      if (this.video) {
        this.addEventListeners();
        clearInterval(myInterval);
      }
    }, 1000);
  }

}

new ContentScript()


