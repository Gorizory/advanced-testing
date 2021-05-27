import {
    Response,
} from 'express';

import {
    Controller,
    Get,
    Res,
} from '@nestjs/common';

import LayoutsService from './services/LayoutsService';

@Controller()
export default class LayoutsController {

    constructor(
        private readonly layoutsService: LayoutsService,
    ) {}

    @Get('*')
    async index(
        @Res() response: Response,
    ) {
        const layout = await this.layoutsService.render();

        response.send(layout);
    }

}
