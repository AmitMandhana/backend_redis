import redis from "../utils/redis";

// Example: Subscribe to customer events
export function subscribeToCustomerEvents() {
  const sub = redis.duplicate(); // Create a new connection for subscription
  const channels = [
    "customer:created",
    "customer:updated",
    "order:created",
    "campaign:created",
    "campaign:queued",
    "segmentRule:created"
  ];
  sub.subscribe(...channels, (err, count) => {
    if (err) {
      console.error("Failed to subscribe: ", err);
      return;
    }
    console.log(`Subscribed to ${count} Redis Pub/Sub channels: ${channels.join(", ")}`);
  });

  sub.on("message", (channel, message) => {
    switch (channel) {
      case "customer:created":
        console.log("[PubSub] New customer created. Reason: Notify other services or trigger workflows.", message);
        break;
      case "customer:updated":
        console.log("[PubSub] Customer updated. Reason: Sync updates across services.", message);
        break;
      case "order:created":
        console.log("[PubSub] New order created. Reason: Start order processing or notify inventory.", message);
        break;
      case "campaign:created":
        console.log("[PubSub] New campaign created. Reason: Prepare campaign for dispatch or analytics.", message);
        break;
      case "campaign:queued":
        console.log("[PubSub] Campaign queued. Reason: Begin campaign dispatch workflow.", message);
        break;
      case "segmentRule:created":
        console.log("[PubSub] New segment rule created. Reason: Update segmentation logic in real-time.", message);
        break;
      default:
        console.log(`[PubSub] Event on ${channel}:`, message);
    }
  });
}
