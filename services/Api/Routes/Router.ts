import { Router } from 'express';
import { Producer } from '../../MessageBroker/Producer';
import { RabbitSendLetter } from '../RabbitConnection/RabbitSendLetter';

const router = Router();
router.post('/sendletter', new RabbitSendLetter().eletronicLetter);

export {
    router
}