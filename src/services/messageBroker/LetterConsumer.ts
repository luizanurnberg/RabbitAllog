import { connectionNotAvailable } from '../../api/messages/exceptions/EAPI/ConnectionNotAvailable';
import { rabbitConnected } from '../../api/messages/success/ConnectedToRabbit';
import amqp, { Connection } from 'amqplib/callback_api';
import { Channel } from 'amqplib';
import * as dotenv from 'dotenv';

export class LetterConsumer {
    public async consumeLetter(): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = 'amqp://localhost';
            const queue: string | undefined = 'letters';
            amqp.connect(`${url}`, function (err: Error, connection: Connection) {
                if (!connection) {
                    throw (connectionNotAvailable());
                }
                console.log(rabbitConnected());
                connection.createChannel(function (err: Error, ch: any) {
                    const channel: Channel = ch;
                    channel.assertQueue(`${queue}`);
                    channel.consume(`${queue}`, (letter: any) => {
                        if (letter) {
                            const message: string = letter.content.toString();
                            console.log('Carta recebida:', message);
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