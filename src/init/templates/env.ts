import { Project } from 'ts-morph';

interface EnvSection {
    comment: string;
    variables: Record<string, string>;
}

export const generateEnvFile = (project: Project, data: PromptConfig): void => {
    const sourceFile = project.createSourceFile('.env', '', {
        overwrite: true
    });

    const envSections: EnvSection[] = [
        {
            comment: 'env',
            variables: {
                NODE_ENV: 'development'
            }
        },
        {
            comment: 'api',
            variables: {
                PORT: '8000',
                API_URL: 'http://localhost:8000/api',
                APP_URL: 'http://localhost:3000'
            }
        }
    ];

    if (data.features.includes('database')) {
        envSections.push({
            comment: 'database',
            variables: {
                DB_USER: 'your_username',
                DB_NAME: 'your_database',
                DB_PWD: 'your_password',
                DB_HOST: 'localhost',
                DB_PORT: '5432'
            }
        });
    }

    if (data.features.includes('jwt')) {
        envSections.push({
            comment: 'jwt',
            variables: {
                ACCESS_JWT_SECRET: 'your_access_secret',
                REFRESH_JWT_SECRET: 'your_refresh_secret'
            }
        });
    }

    const envContent: string = envSections
        .map((section) => [
            `# ${section.comment}`,
            ...Object.entries(section.variables).map(([key, value]) => `${key}=${value}`),
            ''
        ])
        .flat()
        .join('\n')
        .trim();

    sourceFile.addStatements(envContent);
};
