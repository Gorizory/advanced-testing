import {
    Module,
    NestModule,
} from '@nestjs/common';

import EntityService from 'server/common/services/EntityService';
import PointsService from 'server/common/services/PointsService';

import TestsController from './TestsController';

@Module({
    providers: [
        EntityService,
        PointsService,
    ],
    controllers: [
        TestsController,
    ],
})
export default class TestsModule implements NestModule {

    configure() {}

}
