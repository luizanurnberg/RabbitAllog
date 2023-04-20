import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';

export class Consumer {
    async readLetter(): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = process.env.RABBIT_URL;
            const queue: string | undefined = process.env.QUEUE_NAME
            const connection: amqp.Connection = await amqp.connect(`${url}`);
            const channel: amqp.Channel = await connection.createChannel();
            await channel.assertQueue(`${queue}`);

            channel.consume(`${queue}`, (message) => {
                if (message) {
                    const letter: any = JSON.parse(message.content.toString());
                    console.log('Carta eletrônica recebida:', letter);
                    channel.ack(message);
                }
            },
                { noAck: false }
            );
        } catch (error) {
            console.error(error);
        }
    }
}
