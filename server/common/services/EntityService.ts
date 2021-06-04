import {
    IEntity,
} from 'common/types';

import {
    MongoClient,
    ObjectId,
    Collection,

    UpdateQuery,
} from 'mongodb';
import {
    format,
} from 'util';
import {
    Injectable,
    OnModuleInit,
} from '@nestjs/common';

import {
    DATABASE_USER,
    DATABASE_PASSWORD,
} from 'common/libs/env';

const SECURE_FIELDS = [
    'key',
    'keyWords',
    'correctAnswers',
    'answersGroups',
    'eventIds',
    'points',
];

const user = encodeURIComponent(DATABASE_USER);
const password = encodeURIComponent(DATABASE_PASSWORD);
const databaseUrl = format('mongodb://%s:%s@database:27017', user, password);

@Injectable()
export default class EntityService implements OnModuleInit {

    private client = new MongoClient(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    private testsCollection: Collection = null;

    async onModuleInit() {
        await this.client.connect();
        const db = this.client.db('advanced-testing');
        this.testsCollection = db.collection('tests');
    }

    async create(data: IEntity) {
        const createdEntity = await this.testsCollection.insertOne(data);

        return createdEntity.insertedId;
    }

    async createSeveral(data: IEntity[]) {
        const createdEntities = await this.testsCollection.insertMany(data);

        return createdEntities.insertedIds;
    }

    async getOne(query: IEntity) {
        return this.testsCollection.findOne(this.prepareQuery(query));
    }

    async update(_id: string, updateData: UpdateQuery<IEntity>) {
        const filter = this.prepareQuery({
            _id,
        });

        return await this.testsCollection.updateOne(filter, updateData);
    }

    async delete(_id: string) {
        const filter = this.prepareQuery({
            _id,
        });

        return this.testsCollection.deleteOne(filter);
    }

    prepareQuery(query: any) {
        Object.keys(query).forEach((key) => query[key] ?? delete query[key]);

        const {
            _id,
        } = query;
        if (!_id) {
            return query;
        }

        const newId = typeof _id === 'string' ? new ObjectId(_id) : _id;
        return {
            ...query,
            _id: newId,
        };
    }

    prepareResponse(databaseResult: IEntity = {}, clientRequest: IEntity = {}, clearSecureFields = true) {
        const id = databaseResult._id || clientRequest._id;
        if (!id) {
            throw new Error();
        }

        const result = {
            ...clientRequest,
            ...databaseResult,
        };

        if (clearSecureFields) {
            for (const field of SECURE_FIELDS) {
                //@ts-ignore
                delete result[field];
            }
        }

        return {
            [id]: result,
        };
    }

}
