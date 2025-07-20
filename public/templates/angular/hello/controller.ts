import express from 'express';
import services from './hello.service';

const router = express.Router();

router.get('/', services.hello);

export default router;
