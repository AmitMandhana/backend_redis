import { Kafka, logLevel, SASLOptions } from 'kafkajs';
import fs from 'fs';
import path from 'path';

const kafkaBrokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',').map(s => s.trim());

const useSSL = process.env.KAFKA_SSL === 'true';
let ssl: any = undefined;
if (useSSL) {
  const caPath = process.env.KAFKA_CA_CERT_PATH ? path.resolve(process.env.KAFKA_CA_CERT_PATH) : undefined;
  const ca = caPath && fs.existsSync(caPath) ? fs.readFileSync(caPath, 'utf-8') : undefined;
  ssl = { rejectUnauthorized: true, ca: ca ? [ca] : undefined };
}

let sasl: SASLOptions | undefined = undefined;
if (process.env.KAFKA_SASL_MECHANISM && process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD) {
  sasl = {
    mechanism: process.env.KAFKA_SASL_MECHANISM as any, // 'plain' | 'scram-sha-256' | 'scram-sha-512'
    username: process.env.KAFKA_SASL_USERNAME as string,
    password: process.env.KAFKA_SASL_PASSWORD as string,
  };
}

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'amit-crm',
  brokers: kafkaBrokers,
  ssl,
  sasl,
  logLevel: logLevel.NOTHING,
});

export const topics = {
  campaignsDispatch: process.env.KAFKA_TOPIC_DISPATCH || 'campaigns.dispatch',
  campaignsDelivery: process.env.KAFKA_TOPIC_DELIVERY || 'campaigns.delivery',
  campaignsStatus: process.env.KAFKA_TOPIC_STATUS || 'campaigns.status',
};

// Create topics if they don't exist
export async function createTopics() {
  const admin = kafka.admin();
  await admin.connect();
  
  try {
    await admin.createTopics({
      topics: [
        {
          topic: topics.campaignsDispatch,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: topics.campaignsDelivery,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: topics.campaignsStatus,
          numPartitions: 3,
          replicationFactor: 1,
        },
      ],
    });
    console.log('✅ Kafka topics created successfully');
  } catch (error) {
    console.log('ℹ️ Kafka topics may already exist or Kafka is not available');
  } finally {
    await admin.disconnect();
  }
}


