import amqp, { Connection } from 'amqplib/callback_api';
import { Channel } from 'amqplib';
import { connectionNotAvailable } from '../../api/messages/Exceptions/EAPI/ConnectionNotAvailable';
import * as dotenv from 'dotenv';

export class LetterProducer {
    async sendMessageToQueue(message: any): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = process.env.RABBIT_URL;
            const queue: string | undefined = process.env.QUEUE_NAME;
            amqp.connect(`${url}`, function (err: Error, connection: Connection) {
                if (!connection) {
                    throw (connectionNotAvailable());
                }
                connection.createChannel(async function (err: any, ch: any) {
                    let channel: Channel = ch;
                    await channel.sendToQueue(`${queue}`, Buffer.from(JSON.stringify(message)));
                    channel.close();
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}
