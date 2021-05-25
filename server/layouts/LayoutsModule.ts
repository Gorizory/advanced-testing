import {
    Module,
} from '@nestjs/common';

import LayoutService from './services/LayoutsService';
import LayoutsController from './LayoutsController';

@Module({
    providers: [
        LayoutService,
    ],
    controllers: [
        LayoutsController,
    ],
})
export default class LayoutsModule {}
