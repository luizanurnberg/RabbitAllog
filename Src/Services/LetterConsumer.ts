import amqp, { Connection } from 'amqplib/callback_api';
import { Channel } from 'amqplib';
import * as dotenv from 'dotenv';
import { connectionNotAvailable } from '../Api/Messages/Exceptions/EAPI/ConnectionNotAvailable';

export class Consumer {
    async printLetter(): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = process.env.RABBIT_URL;
            const queue: string | undefined = process.env.QUEUE_NAME;
            amqp.connect(`${url}`, function (err: Error, connection: Connection) {
                if (!connection) {
                    throw (connectionNotAvailable());
                }
                connection.createChannel(function (err: any, ch: any) {
                    const channel: Channel = ch;
                    channel.consume(`${queue}`, (letter: any) => {
                        if (letter) {
                            const mensagem: string = letter.content.toString();
                            console.log('Carta recebida:', mensagem);
                            channel.ack(letter);
                        }
                    },
                        { noAck: false }
                    );
                });

            });
        } catch (error) {
            console.error(error);
        }
    }
}