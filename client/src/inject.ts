const ignoredEvents = {
    pause: false,
    unpause: false,
    seeked: false,
};

const element = document.getElementsByTagName("ytmusic-app")[0] as any;
const apiWrapper = element.queue_.queueApi as any;
const api = apiWrapper[Object.keys(apiWrapper)[0]];
startListeners();

window.addEventListener("message", function (event) {
    if (event.data?.from === "ytmparty") {
        const request = event.data;

        switch (request.event) {
            case "pause":
                ignoredEvents.pause = true;
                api.pauseVideo();
                break;
            case "unpause":
                ignoredEvents.unpause = true;
                api.playVideo();
                break;
            case "play":
                const { video_id } = api.getVideoData();
                if (video_id === request.id) return;
                api.cueVideoById(request.id);
                api.playVideo();
                break;
            case "seek":
                ignoredEvents.seeked = true;
                api.seekTo(request.to);
                break;
        }
    }
});

let video: HTMLVideoElement | null = null;

async function startListeners(): Promise<void> {
    video = document.getElementsByTagName("video")[0];
    if (!video) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return startListeners();
    }

    addEventListeners();
}

function addMultiListeners(
    element: HTMLVideoElement,
    listeners: string,
    fn: (e: any) => void,
): void {
    listeners.split(" ").forEach((e) => element.addEventListener(e, fn, false));
}

function sendMessage(message: any): void {
    window.postMessage(
        {
            from: "injected",
            ...message,
        },
        "*",
    );
}

function addEventListeners(): void {
    if (video)
        addMultiListeners(video, "pause play seeked loadedmetadata", (e) => {
            switch (e.type) {
                case "pause":
                    if (ignoredEvents.pause) {
                        ignoredEvents.pause = false;
                        return;
                    }
                    sendMessage({
                        event: "pause",
                    });

                    break;
                case "play":
                    if (ignoredEvents.unpause) {
                        ignoredEvents.unpause = false;
                        return;
                    }
                    sendMessage({
                        event: "unpause",
                    });
                    break;
                case "seeked":
                    if (ignoredEvents.seeked) {
                        ignoredEvents.seeked = false;
                        return;
                    }
                    if (video) {
                        sendMessage({
                            event: "seek",
                            to: video.currentTime,
                        });
                    }

                    break;
                case "loadedmetadata":
                    const { video_id } = api.getVideoData();

                    sendMessage({
                        event: "play",
                        id: video_id,
                    });
                    break;
            }
        });
}
