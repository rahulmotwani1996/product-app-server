import express, { NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { productRouter } from './routes/api/Product/productRoute';
import { logRequest } from './logger';
import mongoose from 'mongoose';

function initializeConnection() {
    mongoose.connect('mongodb://localhost:27017/productDb');
}

const logger = (_req: any, _res: any, next: NextFunction) => {
    logRequest(new Date().getTime());
    next();
}
async function initializeServer() {
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.log('Error occured while opening database connection!');
    });

    db.once('open', () => {
        console.log('Connected to database 🚀');
        const app = express();
        app.use(logger);
        app.use(cors());
        app.use(express.json())
        app.use('/api/product', productRouter);
        app.listen(8080, () => {
            console.debug('Server up at port 8080');
        });
    })

}

try {
    initializeConnection();
    initializeServer();
} catch (error) {
    console.debug(error);
}



