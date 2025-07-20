import express from 'express';
import services from './service';

const router = express.router();

router.get('/', services.hello);

export default router;
