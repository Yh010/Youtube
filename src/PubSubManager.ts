import { createClient, RedisClientType } from "redis";

export class PubSubManager{
    private static instance: PubSubManager;
    private redisClient: RedisClientType;
    private subscriptions: Map<string, string[]>;

    private constructor(){
        this.redisClient = createClient();
        this.redisClient.connect();
        this.subscriptions = new Map();
    }

    public static getinstance(): PubSubManager{
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager();
        }
        return PubSubManager.instance;
    }

    addUserToChannel(userId: string , channelName: string) {
        if (!this.subscriptions.has(channelName)) {
            this.subscriptions.set(channelName, []);
        }
        this.subscriptions.get(channelName)?.push(userId);
        
        if (this.subscriptions.get(channelName)?.length === 1) {
            this.redisClient.subscribe(channelName, (message) => {
                this.handleMessage(channelName, message);
            });
            console.log(`Subscribed to Redis channel: ${channelName}`);
        }
    }

    removeUserFromChannel(userId: string , channelName: string) {
         this.subscriptions.set(channelName, this.subscriptions.get(channelName)?.filter((sub) => sub !== userId) || []);

        if (this.subscriptions.get(channelName)?.length === 0) {
            this.redisClient.unsubscribe(channelName);
            console.log(`UnSubscribed to Redis channel: ${channelName}`);
        }
    }
    
    private handleMessage(channelName: string, message: string) {
        console.log(`Message received on channelName ${channelName}: ${message}`);
        this.subscriptions.get(channelName)?.forEach((subscriber) => {
            console.log(`Sending message to user: ${subscriber}`);
        });
    }
    public async disconnect() {
        await this.redisClient.quit();
    }
}