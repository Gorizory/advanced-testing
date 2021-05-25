import path from 'path';

import {
    Injectable,
} from '@nestjs/common';
import Handlebars from 'handlebars';

import {
    NODE_PATH,
    PROJECT_ROOT,
} from 'common/libs/env';
import {
    readFile,
} from 'server/common/libs/fs';

const LAYOUTS_ROOT = path.join(NODE_PATH, [
    'microservices',
    'layouts',
    'hbs',
].join('/'));
const ASSETS_SOURCE = path.join(PROJECT_ROOT, NODE_PATH, [
    'build_client',
    'assets.json',
].join('/'));

type LayoutType = 'maintenance' | 'main';

@Injectable()
export default class LayoutsService {

    private assets: any;
    private layouts: Partial<Record<LayoutType, any>> = {};

    async render(locals: any) {
        const assets = await this.getAssets();

        const render = await this.renderLayout('main');
        const layoutContent: Record<string, any> = {
            assets,
            locals,
        };

        return render(layoutContent);
    }

    private async renderLayout(layoutType: LayoutType) {
        if (!this.layouts[layoutType]) {
            const filename = path.join(LAYOUTS_ROOT, `${layoutType}.hbs`);
            const template = await readFile(filename);
            this.layouts[layoutType] = Handlebars.compile(template);
        }

        return this.layouts[layoutType];
    }

    private async getAssets() {
        if (!this.assets) {
            this.assets = await readFile(ASSETS_SOURCE)
                .then(JSON.parse)
                .catch(() => ({}));
        }

        return this.assets;
    }

}
