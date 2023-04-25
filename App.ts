import express, { Request, Response } from "express";
import { router } from "./Src/api/Routes/router";
import { appConnected } from "./Src/api/messages/Success/ConnectedToApp";
import { Consumer } from "./Src/services/messageBroker/LetterConsumer";
import { serverConnectionFalied } from "./Src/api/messages/Exceptions/EAPI/ServerConnectionFalied";
import { ERequestStatus } from "./Src/api/enums/Enum";
import { invalidRoute } from "./Src/api/messages/Exceptions/EUS/InvalidRoute";

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
        const consumerRabbit: Consumer = new Consumer();
        await consumerRabbit.printLetter();
    } catch (error) {
        console.error(serverConnectionFalied(), error);
    }
};

startServer();