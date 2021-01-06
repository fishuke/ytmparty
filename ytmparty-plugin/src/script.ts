import * as io from 'socket.io-client';
import {environment} from './environments/environment';

const socket = io(environment.socket);

socket.on('connect', () => {
  console.log('connected');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request });
  if (request.msg) {
    sendResponse({ msg: 'response' });
    return true;
  }
});
function addListenerMulti(el, s, fn): void {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}
function addEventListeners(): void {
  /** listeners abort canplay canplaythrough durationchange emptied encrypted ended error interruptbegin interruptend play playing
   * loadeddata loadedmetadata loadstart mozaudioavailable pause
   * progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting
   */
  addListenerMulti(video, 'pause play seeking seeked loadedmetadata', (e) => {
    if (e.type === 'pause') {
      socket.emit('message', 'pause');
      console.log('pause');
    }
    else if (e.type === 'play') {
      socket.emit('message', 'play');
      console.log('play');
    }
    else if (e.type === 'seeking') {
      socket.emit('message', 'play');
      console.log({ 'seeking to': e.timeStamp });
    }
    else if (e.type === 'seeked') {
      socket.emit('message', 'play');
      console.log({ 'seeked to': e.timeStamp });
    }
    else if (e.type === 'loadedmetadata') {
      // @ts-ignore
      if (navigator.mediaSession.metadata.artwork[0].src.includes('https://i.ytimg.com/')) {
        socket.emit('message', 'advertisement');
        console.log('advertisement');
      }
      else {
        // tslint:disable-next-line
        socket.emit('message', { 'next track': navigator['mediaSession'].metadata, url: window.location.href.split('&')[0] });
        // tslint:disable-next-line
        console.log({ 'next track': navigator['mediaSession'].metadata, url: window.location.href.split('&')[0] });
      }
    }
  });
}
let video;
const myInterval = setInterval(() => {
  video = document.querySelector('video');
  if (video) {
    addEventListeners();
    clearInterval(myInterval);
  }
}, 1000);
