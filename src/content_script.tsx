chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.color) {
        console.log("Receive color = " + msg.color);
        document.body.style.backgroundColor = msg.color;
        sendResponse("Change color to " + msg.color);
    } else {
        sendResponse("Color message is none.");
    }
});

const getInfoFromCommentDOM = (record: HTMLDivElement) => {
    const timestamp = record.querySelector("#timestamp")?.textContent;
    const message = record.querySelector("#message")?.textContent;
    const authorName = record.querySelector("#author-name")?.textContent;

    return { timestamp, message, authorName };
};

const replaceDomText = (record: HTMLDivElement) => {
    const text = record.querySelector("#message")?.textContent;
    if (text)
        if (record.querySelector("#message")?.textContent) {
            record.querySelector("#message")!.textContent = text.replaceAll("草", "lol");
        }
};

const getCommentsDom = () => {
    return (
        document.querySelector("#chat > iframe") as HTMLIFrameElement | null
    )?.contentWindow?.document.querySelector("yt-live-chat-item-list-renderer #items");
};

const onLoad = () => {
    const commentsDOM = getCommentsDom();
    const observer = new MutationObserver((records) => {
        observer.disconnect();
        records.forEach((record) => {
            Array.from(record.addedNodes).forEach((comment) => {
                replaceDomText(comment as HTMLDivElement);
            });
        });
        observer.observe(commentsDOM!, { childList: true });
    });
    if (commentsDOM)
        observer.observe(commentsDOM, {
            childList: true,
        });
};

const main = () => {
    const jsInitCheckTimer = setInterval(() => {
        const target = getCommentsDom();
        if (target?.childNodes.length ?? 0 != 0) {
            clearInterval(jsInitCheckTimer);
            onLoad();
        }
    }, 1000);
};
window.addEventListener("load", main, false);
