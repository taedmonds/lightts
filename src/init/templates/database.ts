import { mkdirSync } from 'fs';
import { join } from 'path';
import { Project } from 'ts-morph';
import { DATABASE_DIR } from '../../config';
import { addDatabaseDummyTemplate } from './features/database/dummy';
import { addDatabaseDataSourceTemplate } from './features/database/root';
import { addDatabaseSeedersTemplate } from './features/database/seeders';

export const generateDatabaseFiles = (project: Project, data: PromptConfig) => {
    const path = join(DATABASE_DIR);
    mkdirSync(path, { recursive: true });
    mkdirSync(join(path, 'entities'), { recursive: true });

    const addConfig: AddDatabaseCommandProps = {
        fileStyle: data.fileStyle,
        dbConfigs: data.dbConfigs
    };

    // index file
    addDatabaseDataSourceTemplate(project, addConfig);

    // migrations
    if (data.dbConfigs.migrations) {
        mkdirSync(join(path, 'migrations'), { recursive: true });
    }

    // seeders
    if (data.dbConfigs.seeders) {
        mkdirSync(join(path, 'seeders/scripts'), { recursive: true });
        addDatabaseSeedersTemplate(project, addConfig);
    }

    // dummy
    if (data.dbConfigs.dummyData) {
        mkdirSync(join(path, 'dummy/scripts'), { recursive: true });
        addDatabaseDummyTemplate(project, addConfig);
    }
};
