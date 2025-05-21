const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'create-topic', brokers: ['localhost:9092'] });

async function createTopic() {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: 'order_created', numPartitions: 3 }],
  });
  await admin.disconnect();
  console.log('Topic created!');
}
createTopic();
