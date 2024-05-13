import amqplib from 'amqplib';
const rabbitMqSetting={
    protocol:'amqp',
    hostname:'localhost',
    port:5672,
    username:'mohamedanas',
    password:'RabbitMq123',
    vhost:'/',
    authMechanism:['PLAIN','AMQPLAIN','EXTERNAL']
}
export const sendMessage = async (queueName, msg) => {
    try {
        const connection = await amqplib.connect(rabbitMqSetting);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: false });

        const messageString = JSON.stringify(msg);
        await channel.sendToQueue(queueName, Buffer.from(messageString));

        console.log('sent: ', messageString);

        await new Promise(resolve => setTimeout(resolve, 100));

        await connection.close();
    } catch (err) {
        console.error(err);
        throw new Error(`Error for creating sendMessaging: ${err.message}`);
    }
}