import { LetterProducer } from "./messageBroker/LetterProducer";
import { Request } from "express";

export class LetterService {
    public publishLetter(letter: Request): void {
        const letterProducer: LetterProducer = new LetterProducer();
        letterProducer.sendMessageToQueue(letter);
    }
}