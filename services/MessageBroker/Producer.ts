import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';

export class Producer {
    async sendLetter(message: any): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = process.env.RABBIT_URL;
            const queue: string | undefined = process.env.QUEUE_NAME
            const connection: amqp.Connection = await amqp.connect(`${url}`);
            const channel: amqp.Channel = await connection.createChannel();

            await channel.assertQueue(`${queue}`);
            await channel.sendToQueue(`${queue}`, Buffer.from(JSON.stringify(message)));
            await channel.close();
            await connection.close();
        } catch (error) {
            console.error(error);
        }
    }

}

