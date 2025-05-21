const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'inventory-svc', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'inventory-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order_created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log(`Inventory updated for Order ID: ${order.id}`);
    },
  });
};

run();
