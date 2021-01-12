class ContentScript {
  private video;
  private extensionId = 'oononiaicnkfdebjkpfabepkggkneeep';
  private isLeftClickClicked: boolean;
  private keysPressed: any;
  private mediaKeysPressed: any;

  constructor() {
    this.findVideoQuery();
    this.listenMessages();
    this.listenMouseEvents();
    this.listenKeyboardEvents();
    this.listenMediaSessionEvents();
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
          // @ts-ignore
          if (navigator.mediaSession.metadata.artwork[0].src.includes('https://i.ytimg.com/')) {
            chrome.runtime.sendMessage(this.extensionId, {event: 'advertisement'});
          } else {
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
      if (which === 1) {
        this.isLeftClickClicked = true;
      }

    });

    document.addEventListener('mouseup', ({which}) => {
      if (which === 1) {
        this.isLeftClickClicked = false;
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

    // @ts-ignore
    const mediaSession = navigator.mediaSession;

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


    mediaSession.setActionHandler('play', ({action}) => {
      this.mediaKeysPressed[action] = true;
      this.video.play();
      setTimeout(() => {
        delete this.mediaKeysPressed[action];
      }, 100);
    });

    mediaSession.setActionHandler('pause', ({action}) => {
      this.mediaKeysPressed[action] = true;
      this.video.pause();
      setTimeout(() => {
        delete this.mediaKeysPressed[action];
      }, 100);
    });

  }
}

// tslint:disable-next-line:no-unused-expression
new ContentScript();


