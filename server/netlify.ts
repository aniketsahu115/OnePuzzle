import serverless from 'serverless-http';
import { createServer } from './main';

let serverlessHandler: any;

const initialize = async () => {
    const { app } = await createServer();
    return serverless(app);
};

const handlerPromise = initialize();

export const handler = async (event: any, context: any) => {
    if (!serverlessHandler) {
        serverlessHandler = await handlerPromise;
    }
    return serverlessHandler(event, context);
}; 