import { Project } from 'ts-morph';
import { getLiteTsConfig } from '../../utils/lightts';
import { formatAndSaveProject } from '../../utils/project';
import { generateController } from './controller';
import { generateResource } from './resource';
import { generateSchema } from './schema';
import { generateService } from './service';

export const generateCommand = async (args: GenerateCommandArguments) => {
    const project = new Project();
    // load lightts config from local project
    const liteTsConfig = getLiteTsConfig();

    const data: GenerateCommandProps = { ...args, lightts: liteTsConfig };

    switch (data.type) {
        case 'c':
        case 'controller':
            await generateController(project, data);
            break;
        case 's':
        case 'service':
            await generateService(project, data);
            break;
        case 'v':
        case 'schema':
            await generateSchema(project, data);
            break;
        case 'r':
        case 'resource':
            await generateResource(project, data);
            break;
        default:
            console.error(`Unknown type: ${data.type}`);
            process.exit(1);
    }

    formatAndSaveProject(project);
};
