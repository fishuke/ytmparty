class ContentScript {
  video;
  extensionId = 'oononiaicnkfdebjkpfabepkggkneeep';

  constructor() {
    this.findVideoQuery();
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
          chrome.runtime.sendMessage(this.extensionId, {event: 'pause'});
          break;
        case 'play':
          chrome.runtime.sendMessage(this.extensionId, {event: 'play'});
          break;
        case 'seeked':
          chrome.runtime.sendMessage(this.extensionId, {event: 'seeked'});
          break;
        case 'loadedmetadata':
          if (navigator.mediaSession.metadata.artwork[0].src.includes('https://i.ytimg.com/')) {
            chrome.runtime.sendMessage(this.extensionId, {event: 'advertisement'});
          } else {
            chrome.runtime.sendMessage(this.extensionId, {event: 'nextTrack', url: window.location.href.split('&')[0]});
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

}

// tslint:disable-next-line:no-unused-expression
new ContentScript();


