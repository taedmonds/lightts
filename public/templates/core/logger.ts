import pino from 'pino';

const log = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

export default log;
