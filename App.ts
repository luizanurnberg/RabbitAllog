import { serverConnectionFalied } from "./src/api/messages/exceptions/EAPI/ServerConnectionFalied";
import { LetterConsumer } from "./src/services/messageBroker/LetterConsumer";
import { invalidRoute } from "./src/api/messages/exceptions/EUS/InvalidRoute";
import { appConnected } from "./src/api/messages/success/ConnectedToApp";
import { ERequestStatus } from "./src/api/enums/Enum";
import express, { Request, Response } from "express";
import { router } from "./src/api/routes/router";

const port = 3000;
const host = '0.0.0.0';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(function (request: Request, response: Response) {
    return response.status(ERequestStatus.NOT_FOUND).json(
        invalidRoute()
    );
})

const startServer: () => Promise<void> = async () => {
    try {
        app.listen(port, host, () => {
            console.log(appConnected());
        });
        const consumerRabbit: LetterConsumer = new LetterConsumer();
        await consumerRabbit.consumeLetter();
    } catch (error) {
        console.error(serverConnectionFalied(), error);
    }
};

startServer();
