import express, { Request, Response } from "express";
import { router } from "./src/api/routes/router";
import { appConnected } from "./src/api/messages/Success/ConnectedToApp";
import { LetterConsumer } from "./src/services/messageBroker/LetterConsumer";
import { serverConnectionFalied } from "./src/api/messages/Exceptions/EAPI/ServerConnectionFalied";
import { ERequestStatus } from "./src/api/enums/Enum";
import { invalidRoute } from "./src/api/messages/Exceptions/EUS/InvalidRoute";

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(function (request: Request, response: Response) {
    return response.status(ERequestStatus.NOT_FOUND).json(
        invalidRoute()
    );
})

const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(appConnected());
        });
        const consumerRabbit: LetterConsumer = new LetterConsumer();
        await consumerRabbit.consumeLetter();
    } catch (error) {
        console.error(serverConnectionFalied(), error);
    }
};

startServer();