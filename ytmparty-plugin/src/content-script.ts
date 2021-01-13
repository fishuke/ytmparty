import {environment} from './environments/environment';

class ContentScript {
  private video;
  private extensionId = environment.extensionId;
  private isLeftClickClicked: boolean;
  private keysPressed: any;
  private mediaKeysPressed: any;

  constructor() {
    this.keysPressed = {};
    this.mediaKeysPressed = {};
    this.findVideoQuery();
    this.listenMessages();
    this.listenMouseEvents();
    this.listenKeyboardEvents();
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
    this.addMultiListeners(this.video, 'pause play seeked loadedmetadata', (e) => {

      switch (e.type) {
        case 'pause':
          if (this.isLeftClickClicked === true || this.mediaKeysPressed.pause || this.keysPressed.Space) {
            chrome.runtime.sendMessage(this.extensionId, {event: 'pause'});
          }
          break;
        case 'play':
          if (this.isLeftClickClicked === true || this.mediaKeysPressed.play || this.keysPressed.Space) {
            chrome.runtime.sendMessage(this.extensionId, {event: 'play'});
          }
          break;
        case 'seeked':
          if (this.isLeftClickClicked === true || this.keysPressed.ArrowRight || this.keysPressed.ArrowLeft) {
            chrome.runtime.sendMessage(this.extensionId, {event: 'seeked', to: this.video.currentTime});
          }
          break;
        case 'loadedmetadata':
          this.listenMediaSessionEvents();
          // @ts-ignore
          if (navigator.mediaSession.metadata.artwork[0].src.includes('https://i.ytimg.com/')) {
            chrome.runtime.sendMessage(this.extensionId, {event: 'advertisement'});
          } else {
            this.listenMediaSessionEvents();
            chrome.runtime.sendMessage(this.extensionId, {
              event: 'nextTrack',
              url: window.location.href.split('&')[0],
              duration: this.video.duration
            });
          }
          break;
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

  listenMessages(): void {
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request) {
          switch (request.event) {
            case 'pause':
              this.video.pause();
              break;
            case 'play':
              this.video.play();
              break;
            case 'nextTrack':
              if (window.location.href.split('&')[0] !== request.url) {
                this.video.pause();
                setTimeout(() => {
                  window.location.href = request.url;
                }, 50);

              }
              break;
            case 'seeked':
              this.video.currentTime = request.to;
              break;
            case 'advertisement':
              console.log('advertisement');
              // @ts-ignore
              if (navigator.mediaSession.metadata.artwork[0].src.includes('https://i.ytimg.com/')) {
                this.video.play();
              } else {
                this.video.pause();
              }
              break;
          }
        }
        sendResponse(true);

      });
  }

  listenMouseEvents(): void {
    document.addEventListener('mousedown', ({which}) => {
      console.log('leftclickdown');
      if (which === 1) {
        this.isLeftClickClicked = true;
      }

    });

    document.addEventListener('mouseup', ({which}) => {
      if (which === 1) {
        setTimeout(() => {
          this.isLeftClickClicked = false;
        }, 50);
      }
    });
  }

  listenKeyboardEvents(): void {
    document.addEventListener('keydown', (keyboardEvent) => {
      this.keysPressed[keyboardEvent.code] = true;
    });

    document.addEventListener('keyup', (keyboardEvent) => {
      setTimeout(() => {
        delete this.keysPressed[keyboardEvent.code];
      }, 50);
    });
  }

  listenMediaSessionEvents(): void {

    // mediaSession.setActionHandler('seekbackward', ({action}) => {
    //   this.mediaKeysPressed[action] = true;
    //   setTimeout(() => {
    //     delete this.mediaKeysPressed[action];
    //   }, 100);
    // });
    //
    // mediaSession.setActionHandler('seekforward', ({action}) => {
    //   this.mediaKeysPressed[action] = true;
    //   setTimeout(() => {
    //     delete this.mediaKeysPressed[action];
    //   }, 100);
    // });

    // mediaSession.setActionHandler('previoustrack', ({action}) => {
    //   this.mediaKeysPressed[action] = true;
    //   setTimeout(() => {
    //     delete this.mediaKeysPressed[action];
    //   }, 100);
    // });
    //
    // mediaSession.setActionHandler('nexttrack', ({action}) => {
    //   this.mediaKeysPressed[action] = true;
    //   setTimeout(() => {
    //     delete this.mediaKeysPressed[action];
    //   }, 100);
    // });

    // @ts-ignore
    navigator.mediaSession.setActionHandler('play', ({action}) => {
      console.log(action);
      this.mediaKeysPressed.play = true;
      this.video.play();
      setTimeout(() => {
        delete this.mediaKeysPressed.play;
      }, 100);
    });

    // @ts-ignore
    navigator.mediaSession.setActionHandler('pause', ({action}) => {
      console.log(action);
      this.mediaKeysPressed.pause = true;
      this.video.pause();
      setTimeout(() => {
        delete this.mediaKeysPressed.pause;
      }, 100);
    });

  }
}

// tslint:disable-next-line:no-unused-expression
new ContentScript();


