chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({request});
  if (request.msg) {
    sendResponse({msg: 'response'});
    return true;
  }
});
navigator.mediaSession.setActionHandler("play", async () => {
  console.log('played');
  await document.querySelector("video").play();
  navigator.mediaSession.playbackState = "playing";
});

navigator.mediaSession.setActionHandler("pause", () => {
  console.log('paused');
  document.querySelector("video").pause();
  navigator.mediaSession.playbackState = "paused";
});
