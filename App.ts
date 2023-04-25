import { serverConnectionFalied } from "./srcc/api/messages/exceptions/EAPI/ServerConnectionFalied";
import { LetterConsumer } from "./srcc/services/messageBroker/LetterConsumer";
import { invalidRoute } from "./srcc/api/messages/exceptions/EUS/InvalidRoute";
import { appConnected } from "./srcc/api/messages/success/ConnectedToApp";
import { ERequestStatus } from "./srcc/api/enums/Enum";
import express, { Request, Response } from "express";
import { router } from "./srcc/api/routes/router";

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