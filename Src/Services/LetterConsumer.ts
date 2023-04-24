import amqp from 'amqplib/callback_api';
import * as dotenv from 'dotenv';
import { connectionNotAvailable } from '../Api/Messages/Exceptions/EAPI/ConnectionNotAvailable';

export class Consumer {
    async printLetter(): Promise<void> {
        try {
            dotenv.config();
            const url: string | undefined = process.env.RABBIT_URL;
            const queue: string | undefined = process.env.QUEUE_NAME;
            amqp.connect(`${url}`, function (err: any, connection: any) {
                if (!connection) {
                    throw (connectionNotAvailable());
                }
                let channel: any = null;
                connection.createChannel(function (err: any, ch: any) {
                    channel = ch;
                    channel.consume(queue, (letter: any) => {
                        if (letter) {
                            const mensagem: any = letter.content.toString();
                            console.log('Carta recebida:', mensagem);
                            channel.ack(letter);
                        }
                    },
                        { noAck: false }
                    );
                });

            });
        } catch (error) {
            console.log(error);
        }
    }
}