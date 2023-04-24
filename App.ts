import express from "express";
import { router } from "./Src/Api/Routes/router";
import { appConnected } from "./Src/Api/Messages/Success/ConnectedToApp";
import { Consumer } from "./Src/Services/LetterConsumer";

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(port, async () => {
    console.log(appConnected());
    const consumerRabbit: Consumer = new Consumer();
    await consumerRabbit.printLetter();
})