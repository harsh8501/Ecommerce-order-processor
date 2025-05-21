const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const kafka = new Kafka({ clientId: 'order-svc', brokers: ['localhost:9092'] });
const producer = kafka.producer();

app.use(express.json());

app.post('/order', async (req, res) => {
  const order = { id: Date.now(), ...req.body };
  await producer.connect();
  await producer.send({
    topic: 'order_created',
    messages: [{ value: JSON.stringify(order) }],
  });
  await producer.disconnect();
  res.send({ success: true, order });
});

app.listen(3000, () => console.log('Order service running on port 3000'));
