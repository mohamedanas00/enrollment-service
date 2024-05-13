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
export const receivedMessage = async (queueName) => {
    try {
        const connection = await amqplib.connect(rabbitMqSetting);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: false });
        console.log(`Waiting for messages in queue: ${queueName}`);

        return new Promise((resolve, reject) => {
            const messages = [];

            channel.consume(queueName, (msg) => {
                const messageObject = JSON.parse(msg.content.toString());
                messages.push(messageObject);
                channel.ack(msg);
                
                console.log("Done processing message");
            }, { noAck: false });

            setTimeout(() => {
                channel.close();
                connection.close();

                resolve(messages);
            }, 5000); 
        });
    } catch (err) {
        console.error(err);
        throw new Error(`Error for received Messages: ${err.message}`);
    }
};