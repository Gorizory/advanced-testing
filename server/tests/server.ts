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

    await app.listen(3002);
};

bootstrap();
