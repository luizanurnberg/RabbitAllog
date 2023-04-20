import { Producer } from '../../MessageBroker/Producer';
import { Request, Response } from 'express';

export class RabbitSendLetter {
    async eletronicLetter(request: Request, response: Response) {
        try {
            //fazer validacoes de from e to
            const electronicLetter = request.body;
            const produceLetter = new Producer();
            await produceLetter.sendLetter(electronicLetter);
            response.status(200).json({ message: 'Electronic letter sent successfully!' });
        } catch (error) {
            console.error(error);
        }
    }

}