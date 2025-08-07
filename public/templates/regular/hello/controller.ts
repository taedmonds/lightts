import express from 'express';
import services from './service';

const router = express.Router();

router.get('/', services.hello);

export default router;
