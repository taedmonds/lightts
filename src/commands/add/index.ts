import { Project } from 'ts-morph';
import { getLightTsConfig } from '../../utils/lightts';
import { formatAndSaveProject } from '../../utils/project';
import { addCorsFeature } from './cors';
import { addDatabaseFeature } from './database';
import { addJWTFeature } from './jwt';
import { addValidationFeature } from './validation';

export const addCommand = async (args: AddCommandArguments) => {
    const project = new Project();
    // load lightts config from local project
    const lightTsConfig = getLightTsConfig();

    const data: AddCommandProps = { ...args, lightts: lightTsConfig };
    switch (data.feature) {
        case 'cors':
            addCorsFeature(project, data);
            break;
        case 'jwt':
            addJWTFeature(project, data);
            break;
        case 'validation':
            addValidationFeature(data);
            break;
        case 'database':
            addDatabaseFeature(project, data);
            break;
        default:
            console.error(`Unknown type: ${data.feature}`);
            process.exit(1);
    }

    formatAndSaveProject(project);
};
