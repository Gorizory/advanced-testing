import {
    Module,
    NestModule,
} from '@nestjs/common';

import EntityService from 'server/common/services/EntityService';

import TestsController from './TestsController';

@Module({
    providers: [
        EntityService,
    ],
    controllers: [
        TestsController,
    ],
})
export default class TestsModule implements NestModule {

    configure() {}

}
