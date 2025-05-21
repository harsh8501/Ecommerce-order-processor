const { Kafka } = require('kafkajs');
const amqp = require('amqplib');

const kafka = new Kafka({ clientId: 'notification-svc', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'notification-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order_created', fromBeginning: true });

    // RabbitMQ setup
    const rabbitConn = await amqp.connect('amqp://localhost');
    const channel = await rabbitConn.createChannel();
    const queue = 'email-queue';
    await channel.assertQueue(queue, { durable: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            console.log(`Sending email for Order ID: ${order.id}`);

            // Send to RabbitMQ queue
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), {
                persistent: true
            });

            console.log(`✅ Email sent for Order ID: ${order.id}`);
        },
    });
};

run();
