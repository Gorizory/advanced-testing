import {
    NestFactory,
} from '@nestjs/core';
import {
    NestExpressApplication,
} from '@nestjs/platform-express';

import LayoutsModule from './LayoutsModule';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(
        LayoutsModule,
    );

    await app.listen(3000);
};

bootstrap();
