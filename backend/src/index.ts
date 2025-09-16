import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import {Request, Response} from "express";
import { success } from "./utils/response";
import connectDB from "./utils/connectDb";
import { startDispatcher } from "./workers/dispatcher";
import { startDeliveryWorker } from "./workers/delivery";
import { startStatusWorker } from "./workers/status";
import { createTopics } from "./utils/kafka";

import { subscribeToCustomerEvents } from "./utils/redisSubscriber";

const PORT = process.env.PORT || 3000;

connectDB();

// Start Redis subscriber for demonstration
subscribeToCustomerEvents();








// Create Kafka topics and start workers
async function startKafkaWorkers() {
  try {
    await createTopics();
    // Start workers after topics are created
    startDispatcher().catch(console.error);
    startDeliveryWorker().catch(console.error);
    startStatusWorker().catch(console.error);
  } catch (error) {
    console.error('❌ Error starting Kafka workers:', error);
  }
}

startKafkaWorkers();

app.get("/", (req: Request, res: Response) => {
    const response = success("Welcome to AMIT CRM Management Server", 200);
    res.status(response.status).json(response);
}
);

app.listen(PORT, () =>{
    console.log(`🚀 AMIT CRM Management Server is running on port ${PORT}`);
    console.log(`📊 API Documentation available at http://localhost:${PORT}/api-docs`);
})
