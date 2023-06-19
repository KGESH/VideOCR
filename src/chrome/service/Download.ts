import {DownloadRequest} from "@src/chrome/types/Download";


export const saveImageFile = (dataUrl: string) => {
    chrome.downloads.download(
        {
            filename: "example.png",
            url: dataUrl,
        },
        (downloadId) => {
            console.log("downloadId", downloadId);
        }
    );
};

export const downloadFile = (req: DownloadRequest) => {
    chrome.runtime.sendMessage(req, (res) => {
        console.log("After Download res: ", res);
    });
}