import { checkbox, input, select } from '@inquirer/prompts';
import { askDbType, askDummyData, askMigrations, askSeeders } from './database';

export const prompts = async (): Promise<PromptConfig> => {
    const name = await input({
        message: 'What’s the name of your project?',
        default: 'epic-api',
        validate: (value: string) => value.trim().length > 0 || 'Please give your project a name!'
    });

    const fileStyle: FileStyle = await select({
        message: 'Pick a file naming style that suits you! (Use arrow keys)',
        choices: [
            {
                name: 'Angular',
                value: 'angular',
                description: 'Structured and descriptive, e.g., auth.service.ts'
            },
            { name: 'Regular', value: 'regular', description: 'Simple and clean, e.g., auth.ts' }
        ],
        default: 'angular'
    });

    const features: Features[] = await checkbox({
        message:
            'Select the superpowers your project needs! (Press <space> to select, <enter> to proceed)',
        choices: [
            {
                name: 'JWT',
                value: 'jwt',
                description: 'Secure your API with JSON Web Tokens for authentication magic'
            },
            {
                name: 'Cors',
                value: 'cors',
                description: 'Allow secure cross-origin requests'
            },
            {
                name: 'Validation',
                value: 'validation',
                description: 'Keep your API requests squeaky clean with robust validation'
            },
            {
                name: 'Database',
                value: 'database',
                description: 'Power up with a TypeORM database integration'
            }
        ]
    });

    const dbConfigs: DBConfigs = {
        dbType: 'none',
        seeders: false,
        migrations: false,
        dummyData: false
    };
    if (features.includes('database')) {
        dbConfigs.dbType = await askDbType();
        dbConfigs.seeders = await askSeeders();
        dbConfigs.dummyData = await askDummyData();
        dbConfigs.migrations = await askMigrations();
    }

    const lintConfigs: LintConfigs[] = await checkbox({
        message: 'Set up your code quality tools! (Press <space> to select, <enter> to proceed)',
        choices: [
            {
                name: 'ESLint',
                value: 'eslint',
                description: 'Catch code issues early with ESLint for TypeScript'
            },
            {
                name: 'Prettier',
                value: 'prettier',
                description: 'Keep your code style consistent with Prettier formatting'
            },
            {
                name: 'Husky',
                value: 'husky',
                description: 'Run linting on commit with Husky for clean git history'
            }
        ]
    });

    const pkg: PKGTypes = await select({
        message: 'Choose your package manager sidekick! (Use arrow keys)',
        choices: [
            { name: 'NPM', value: 'npm' },
            { name: 'PNPM', value: 'pnpm' },
            { name: 'Yarn', value: 'yarn' }
        ],
        default: 'npm'
    });

    return {
        name,
        fileStyle,
        features,
        dbConfigs,
        lintConfigs,
        pkg
    };
};
