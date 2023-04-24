import { Request, Response } from 'express';
import { ERequestStatus } from './Enums/Enum';
import { errorFromSystem } from './Messages/Exceptions/EAPI/ErrorFromSystem';
import { emptyField } from './Messages/Exceptions/EUS/EmptyField';
import { letterSent } from './Messages/Success/LetterSent';
import { Producer } from '../Services/LetterProducer';

export class Api {
    async manageRabbitService(request: Request, response: Response): Promise<Response<any, Record<string, any>> | undefined> {
        try {
            const { FROM, TO } = request.body;
            if (!FROM || !TO) {
                return response.status(ERequestStatus.BAD_REQUEST).json(emptyField());
            }
            const producerRabbit: Producer = new Producer();
            const letter: any = request.body;
            await producerRabbit.sendMessageToQueue(letter); {
                return response.status(ERequestStatus.SUCCESS).json(letterSent());
            }
        } catch (error) {
            console.error(error);
            return response.status(ERequestStatus.BAD_REQUEST).json(errorFromSystem());
        }
    }
}