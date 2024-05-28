import { PubSubManager } from "./PubSubManager";

setInterval(() => {
    PubSubManager.getinstance().addUserToChannel(Math.random().toString(), "YoutubeOfficial");
}, 5000)
