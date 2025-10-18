const amqplib = require('amqplib');

let channel, connection;

async function connect() {
    try {
        connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();

        await channel.assertQueue('notifications');
    } catch (error) {
        console.log(error);
    }
}

async function sendMessage(message) {
    try {
        await channel.sendToQueue('notifications', Buffer.from(JSON.stringify(message)));
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect, sendMessage };