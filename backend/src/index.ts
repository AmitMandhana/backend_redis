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

const PORT = process.env.PORT || 3000;

connectDB();

// Keep-alive ping configuration
const interval = 30000; // 30 seconds
const EXTERNAL_URL = 'https://backup-crm-1.onrender.com';

function reloadWebsite() {
  axios
    .get(`${EXTERNAL_URL}/health`)
    .then((response) => {
      console.log("Keep-alive ping successful");
    })
    .catch((error) => {
      console.error(`Keep-alive ping failed: ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);


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
