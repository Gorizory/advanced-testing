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
    Injectable,
    OnModuleInit,
} from '@nestjs/common';

const SECURE_FIELDS = [
    'key',
    'keyWords',
    'correctAnswers',
];

@Injectable()
export default class EntityService implements OnModuleInit {

    private client = new MongoClient('mongodb://database:27017', {
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
        const createdTest = await this.testsCollection.insertOne(data);

        return createdTest.insertedId;
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
