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
    Query,
    Res,
} from '@nestjs/common';
import {
    Response,
} from 'express';
import {
    ObjectId,
} from 'mongodb';
import shortid from 'shortid';

import EntityService from 'server/common/services/EntityService';
import PointsService from 'server/common/services/PointsService';

@Controller('tests')
export default class TestsController {

    constructor(
        private readonly entityService: EntityService,
        private readonly pointsService: PointsService,
    ) {}

    @Get(':testId')
    async get(
        @Param('testId') testId: string,
        @Query() params: {key?: string},
        @Res() response: Response,
    ) {
        const test = await this.entityService.getOne({
            _id: testId,
            type: EntityTypes.Test,
            key: params.key,
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
            name: '',
            taskIds: [] as string[],
            keyWords: [] as string[],
            key: shortid.generate(),
        };

        const createdId = await this.entityService.create(requestedFields);

        const responseBody = this.entityService.prepareResponse({
            _id: createdId,
        }, requestedFields, false);
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

        const responseBody = this.entityService.prepareResponse({}, {
            _id: testId,
            ...body,
        });
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Get('task/:taskId')
    async getTask(
        @Param('taskId') taskId: string,
        @Query() params: {key?: string},
        @Res() response: Response,
    ) {
        const task = await this.entityService.getOne({
            _id: taskId,
            type: EntityTypes.Task,
        });

        const responseBody = this.entityService.prepareResponse(task, {}, !params.key);
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Post('task/:testId')
    async addTask(
        @Param('testId') testId: string,
        @Body() body: ITask,
        @Res() response: Response,
    ) {
        const task = {
            ...body,
            points: this.pointsService.calculateMaxTaskPoint(body),
        };
        const createdTaskId = await this.entityService.create(task);
        await this.entityService.update(testId, {
            $push: {
                taskIds: createdTaskId.toHexString(),
            },
        });
        const test = await this.entityService.getOne({
            _id: testId,
        });

        const responseBody = {
            ...(this.entityService.prepareResponse({
                _id: createdTaskId,
            }, task, false)),
            ...(this.entityService.prepareResponse(test, {}, false)),
        };
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
            $set: {
                ...body,
                points: this.pointsService.calculateMaxTaskPoint(body),
            },
        });
        const task = await this.entityService.getOne({
            _id: taskId,
        });

        const responseBody = this.entityService.prepareResponse(task, {}, false);
        response
            .status(HttpStatus.OK)
            .send(responseBody);
    }

    @Delete('task/:taskId')
    async deleteTask(
        @Param('taskId') taskId: string,
        @Query() params: {key?: string},
        @Res() response: Response,
    ) {
        const test = await this.entityService.getOne({
            type: EntityTypes.Test,
            key: params.key,
        });
        if (!test) {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send();
        }

        await this.entityService.update(test._id, {
            $pullAll: {
                taskIds: [new ObjectId(taskId)],
            },
        });
        const updatedTest = await this.entityService.getOne({
            _id: test._id,
        });

        const responseBody = this.entityService.prepareResponse(updatedTest);
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
            answerIds: [],
            eventIds: [],
        });
        const createdEventId = await this.entityService.create({
            type: EntityTypes.GlobalEvent,
            eventType: EventTypes.ResultCreated,
            resultId: createdResultId.toHexString(),
            timestamp: Date.now(),
        });

        await this.entityService.update(createdResultId, {
            $push: {
                eventIds: createdEventId.toHexString(),
            },
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
        @Body() body: IEvent[],
        @Res() response: Response,
    ) {
        const createdEventsIds = await this.entityService.createSeveral(body);

        await this.entityService.update(resultId, {
            $push: {
                eventIds: {
                    $each: (Object.values(createdEventsIds) as ObjectId[]).map((id) => id.toHexString()),
                },
            },
        });

        response
            .status(HttpStatus.OK)
            .send();
    }

    @Post('answer/:resultId')
    async addAnswer(
        @Param('resultId') resultId: string,
        @Body() body: {
            answer: IAnswer,
            events: IEvent[],
        },
        @Res() response: Response,
    ) {
        const createdEventIds = await this.entityService.createSeveral(body.events);

        const createdAnswerId = await this.entityService.create({
            ...body.answer,
            eventIds: Object.values(createdEventIds).map((id) => id.toHexString()),
        });

        await this.entityService.update(resultId, {
            $push: {
                answerIds: createdAnswerId.toHexString(),
            },
        });

        const updatedResult = await this.entityService.getOne({
            _id: resultId,
        });

        const responseBody = this.entityService.prepareResponse(updatedResult);
        response
            .status(HttpStatus.CREATED)
            .send(responseBody);
    }

}
