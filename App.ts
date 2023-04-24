import express from "express";
import { router } from "./Src/Api/Routes/router";
import { appConnected } from "./Src/Api/Messages/Success/ConnectedToApp";
import { Consumer } from "./Src/Services/LetterConsumer";
import { serverConnectionFalied } from "./Src/Api/Messages/Exceptions/EAPI/ServerConnectionFalied";

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

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