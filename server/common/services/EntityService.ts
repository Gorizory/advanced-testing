import {
    Entities,
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

    async create(data: Entities) {
        const createdTest = await this.testsCollection.insertOne(data);

        return createdTest.insertedId;
    }

    async getOne(query: Entities) {
        return this.testsCollection.findOne(this.prepareQuery(query));
    }

    async update(_id: string, updateData: UpdateQuery<Entities>) {
        const filter = this.prepareQuery({
            _id,
        });

        return this.testsCollection.updateOne(filter, updateData);
    }

    prepareQuery(query: any) {
        if (!query._id) {
            return query;
        }

        return {
            ...query,
            _id: new ObjectId(query._id),
        };
    }

    prepareResponse(databaseResult: Entities, clientRequest?: Entities) {
        const id = databaseResult._id || clientRequest._id;
        if (!id) {
            throw new Error();
        }

        const result = {
            ...clientRequest,
            ...databaseResult,
        };
        delete result._id;

        return {
            [id]: result,
        };
    }

}
