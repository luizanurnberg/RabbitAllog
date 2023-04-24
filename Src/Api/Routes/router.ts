import { Router } from 'express';
import { Api } from '../Index';

const router: Router = Router();
router.post('/sendletter', new Api().manageRabbitService);

export {
    router
}