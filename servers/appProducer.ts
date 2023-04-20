import bodyParser from 'body-parser';
import express from 'express';
import amqp from 'amqplib';
import { router } from '../services/Api/Routes/Router';
import { Consumer } from '../services/MessageBroker/Consumer'

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

app.listen(port, async () => {
    console.log('Aplicação rodando!');
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('letters', { durable: false });
    channel.consume('letters', new Consumer().readLetter, { noAck: true });
})