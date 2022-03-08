const element = document.getElementsByTagName("ytmusic-app")[0] as any;
const apiWrapper = element.queue_.queueApi as any;
window.api = apiWrapper[Object.keys(apiWrapper)[0]];
