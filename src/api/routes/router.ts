import { Router } from 'express';
import { Index } from '../Index';

const router: Router = Router();
router.post('/sendletter', new Index().processApiData);

export {
    router
}