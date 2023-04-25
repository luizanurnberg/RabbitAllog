import { Request, Response } from 'express';
import { ERequestStatus } from './enums/Enum';
import { errorFromSystem } from './messages/Exceptions/EAPI/ErrorFromSystem';
import { letterSent } from './messages/Success/LetterSent';
import { emptyField } from './messages/Exceptions/EUS/emptyField';
import { LetterService } from '../services/LetterService';

export class Api {
    async manageRabbitService(request: Request, response: Response): Promise<Response<any, Record<string, any>> | undefined> {
        try {
            //colocar depois uma validacao caso a mensagem esteja em branco 
            const { FROM, TO } = request.body;
            if (!FROM || !TO) {
                return response.status(ERequestStatus.BAD_REQUEST).json(emptyField());
            }
            const producerRabbit = new LetterService();
            const letter: Request = request.body;
            producerRabbit.publishLetter(letter); {
                return response.status(ERequestStatus.SUCCESS).json(letterSent());
            }
        } catch (error) {
            console.error(error);
            return response.status(ERequestStatus.BAD_REQUEST).json(errorFromSystem());
        }
    }
}