const element = document.getElementsByTagName("ytmusic-app")[0] as any;
const apiWrapper = element.queue_.queueApi as any;
const api = apiWrapper[Object.keys(apiWrapper)[0]];

window.addEventListener("message", function (event) {
    if (event.data?.from === "ytmparty") {
        const request = event.data;

        switch (request.event) {
            case "pause":
                api.pauseVideo();
                break;
            case "unpause":
                api.playVideo();
                break;
            case "play":
                api.cueVideoById(request.id);
                api.playVideo();
                break;
            case "seeked":
                api.seekTo(request.to);
                break;
        }
    }
});
