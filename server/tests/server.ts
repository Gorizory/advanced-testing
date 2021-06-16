import bodyParser from 'body-parser';
import {
    NestFactory,
} from '@nestjs/core';
import {
    NestExpressApplication,
} from '@nestjs/platform-express';

import TestsModule from './TestsModule';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(
        TestsModule,
    );

    app.use(bodyParser.json({limit: '50mb'}));

    await app.listen(3002);
};

bootstrap();
