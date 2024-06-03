import { connectionNotAvailable } from '../../api/messages/exceptions/EAPI/ConnectionNotAvailable';
import amqp, { Connection } from 'amqplib/callback_api';
import { Channel } from 'amqplib';
import { Request } from 'express';
import * as dotenv from 'dotenv';

export class LetterProducer {
    public async sendMessageToQueue(message: Request): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = 'amqp://localhost';
            const queue: string | undefined = 'letters';
            amqp.connect(`${url}`, function (err: Error, connection: Connection) {
                if (!connection) {
                    throw (connectionNotAvailable());
                }
                connection.createChannel(async function (err: any, ch: any) {
                    let channel: Channel = ch;
                    channel.assertQueue(`${queue}`);
                    await channel.sendToQueue(`${queue}`, Buffer.from(JSON.stringify(message)));
                    channel.close();
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}
