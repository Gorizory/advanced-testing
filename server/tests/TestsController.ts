import {
    EntityTypes,
    EventTypes,

    IAnswer,
    IEvent,
    ITask,
    ITest,
} from 'common/types';

import {
    Get,
    Post,
    Patch,
    Delete,

    Body,
    Controller,
    HttpStatus,
    Param,
    Res,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';

import EntityService from 'server/common/services/EntityService';

@Controller('tests')
export default class TestsController {

    constructor(
        private readonly entityService: EntityService
    ) {}

    @Get(':testId')
    async get(
        @Param('testId') testId: string,
        @Res() response: Response,
    ) {
        const test = await this.entityService.getOne({
            _id: testId,
            type: EntityTypes.Test,
        });

        if (!test) {
            return response
                .status(HttpStatus.NOT_FOUND)
                .send();
        }

        const responseBody = this.entityService.prepareResponse(test);
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Post()
    async create(
        @Res() response: Response,
    ) {
        const requestedFields = {
            type: EntityTypes.Test,
            isFinished: false,
        };

        const createdId = await this.entityService.create(requestedFields);

        const responseBody = this.entityService.prepareResponse({
            _id: createdId,
        }, requestedFields);
        response
            .status(HttpStatus.CREATED)
            .send(responseBody);
    }

    @Patch(':testId')
    async update(
        @Param('testId') testId: string,
        @Body() body: ITest,
        @Res() response: Response,
    ) {
        await this.entityService.update(testId, {
            $set: body,
        });

        const responseBody = this.entityService.prepareResponse({}, body);
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Post('task/:testId')
    async addTask(
        @Param('testId') testId: string,
        @Body() body: ITest,
        @Res() response: Response,
    ) {
        const createdTaskId = await this.entityService.create(body);
        await this.entityService.update(testId, {
            $push: {
                taskIds: createdTaskId,
            }
        });
        const test = await this.entityService.getOne({
            _id: testId,
        })

        const responseBody = {
            ...(this.entityService.prepareResponse({
                _id: createdTaskId,
            }, body)),
            ...(this.entityService.prepareResponse(test)),
        }
        response
            .status(HttpStatus.CREATED)
            .send(responseBody);
    }

    @Patch('task/:taskId')
    async updateTask(
        @Param('taskId') taskId: string,
        @Body() body: ITask,
        @Res() response: Response,
    ) {
        await this.entityService.update(taskId, {
            $set: body,
        });
        const task = await this.entityService.getOne({
            _id: taskId,
        });

        const responseBody = this.entityService.prepareResponse(task);
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Post('result/:testId')
    async createResult(
        @Param('testId') testId: string,
        @Res() response: Response,
    ) {
        const createdResultId = await this.entityService.create({
            type: EntityTypes.Result,
            testId,
            answers: [],
            events: [
                {
                    type: EventTypes.TestStart,
                    timestamp: Date.now(),
                }
            ],
        });
        const result = await this.entityService.getOne({
            _id: createdResultId,
        });

        const responseBody = this.entityService.prepareResponse(result);
        response
            .status(HttpStatus.CREATED)
            .send(responseBody);
    }

    @Patch('result/:resultId')
    async addEventToResult(
        @Param('resultId') resultId: string,
        @Body() body: IEvent,
        @Res() response: Response,
    ) {
        await this.entityService.update(resultId, {
            $push: {
                events: body,
            },
        });
        const result = await this.entityService.getOne({
            _id: resultId,
        });

        const responseBody = this.entityService.prepareResponse(result);
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Post('answer')
    async addAnswer(
        @Body() body: IAnswer,
    ) {
        
    }

}
