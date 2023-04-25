import { errorFromSystem } from './messages/exceptions/EAPI/ErrorFromSystem';
import { emptyMessage } from './messages/exceptions/EUS/EmptyMessage';
import { emptyField } from './messages/exceptions/EUS/emptyField';
import { letterSent } from './messages/success/LetterSent';
import { LetterService } from '../services/LetterService';
import { Request, Response } from 'express';
import { ERequestStatus } from './enums/Enum';

export class Index {
    async processApiData(request: Request, response: Response): Promise<Response<any, Record<string, any>> | undefined> {
        try {
            const letter: any = request.body;
            if (!letter.FROM || !letter.TO) {
                return response.status(ERequestStatus.BAD_REQUEST).json(emptyField());
            }
            if (letter.MESSAGE.trim().length === 0) {
                return response.status(ERequestStatus.BAD_REQUEST).json(emptyMessage());
            }
            const producerRabbit = new LetterService();
            producerRabbit.publishLetter(letter); {
                return response.status(ERequestStatus.SUCCESS).json(letterSent());
            }
        } catch (error) {
            console.error(error);
            return response.status(ERequestStatus.BAD_REQUEST).json(errorFromSystem());
        }
    }
}