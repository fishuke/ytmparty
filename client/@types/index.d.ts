export {};

declare global {
    interface Window {
        api: {
            cueVideoById: (id: string) => void;
            pauseVideo: () => void;
            playVideo: () => void;
            seekTo: (seconds: number) => void;
        };
    }
}
