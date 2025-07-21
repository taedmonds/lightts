import { Project } from 'ts-morph';
import fs from 'fs';

export const generateReadMe = (project: Project, data: PromptConfig): void => {
    const readMeSections: {
        title: string;
        content: string[];
    }[] = [
        {
            title: `# LightTs API`,
            content: [
                `A Node.js API project generated with **LightTs**, a lightweight and flexible framework for building simple, scalable, and customizable APIs with minimal configuration.`,
                ``,
                `LightTs combines the power of Express.js with a structured project layout, code generation via CLI, and optional features like database integration, validation, and JWT authentication.`
            ]
        },
        {
            title: '## Getting Started',
            content: [
                `Basic setup instructions including system requirements, installation, and available development scripts.`,
                ``,
                `### Prerequisites`,
                ``,
                `System and tool requirements before setting up the project:`,
                `- Node.js >= 20`,
                `- ${data.pkg.charAt(0).toUpperCase() + data.pkg.slice(1)} (package manager)`,
                ``,
                `### Installation`,
                ``,
                `Installs all required project dependencies defined in \`package.json\`:`,
                `\`\`\`bash`,
                `${data.pkg} install`,
                `\`\`\``,
                ``,
                `### Scripts`,
                ``,
                `List of available CLI scripts to run, build, and manage the project:`,
                `\`\`\`bash`,
                ...Object.entries({
                    start: 'Run the compiled application',
                    dev: 'Run in development mode with nodemon',
                    ...(data.features.includes('database') && {
                        typeorm: 'Run TypeORM CLI commands',
                        migrate: 'Run database migrations',
                        seed: 'Run database seeders',
                        ...(data.dbConfigs.dummyData && { dummy: 'Run dummy data scripts' })
                    }),
                    build: 'Compile TypeScript to JavaScript',
                    ...(data.features.includes('database') && {
                        'build:migrate': 'Run migrations on compiled code',
                        'build:seed': 'Run seeders on compiled code'
                    }),
                    ...(data.lintConfigs.includes('eslint') && {
                        lint: 'Run ESLint for code quality',
                        'lint:fix': 'Fix ESLint issues automatically'
                    }),
                    ...(data.lintConfigs.includes('prettier') && {
                        format: 'Format code with Prettier'
                    }),
                    ...(data.lintConfigs.includes('husky') && {
                        prepare: 'Set up Husky for Git hooks'
                    })
                }).map(([script, description]) => `${data.pkg} run ${script} # ${description}`),
                `\`\`\``
            ]
        },
        {
            title: '## Features',
            content: [
                `Overview of the core and optional features included in the project.`,
                ``,
                `- **LightTs CLI**: CLI tool to generate components and manage features.`,
                `- **Express-Based**: Uses Express for routing and middleware.`,
                ...(data.features.includes('jwt')
                    ? ['- **JWT Authentication**: Access and refresh token handling.']
                    : []),
                ...(data.features.includes('cors')
                    ? ['- **CORS**: Cross-origin request configuration.']
                    : []),
                ...(data.features.includes('validation')
                    ? ['- **Validation**: Request validation using Joi schemas.']
                    : []),
                ...(data.features.includes('database')
                    ? [
                          `- **Database**: TypeORM setup with ${data.dbConfigs.dbType}.`,
                          ...(data.dbConfigs.migrations ? ['  - Migration support.'] : []),
                          ...(data.dbConfigs.seeders ? ['  - Seeder support.'] : []),
                          ...(data.dbConfigs.dummyData ? ['  - Dummy data generation.'] : [])
                      ]
                    : []),
                ...(data.lintConfigs.includes('eslint')
                    ? ['- **ESLint**: Linting configuration for consistent code.']
                    : []),
                ...(data.lintConfigs.includes('prettier')
                    ? ['- **Prettier**: Pre-configured code formatter.']
                    : []),
                ...(data.lintConfigs.includes('husky')
                    ? ['- **Husky**: Git hooks integration for pre-commit checks.']
                    : []),
                ``
            ]
        },
        {
            title: '## Usage',
            content: [
                `Details on using the CLI, response classes, and error handling.`,
                ``,
                `### CLI Commands`,
                ``,
                `\`\`\`bash`,
                `lts generate controller user # Create a ${
                    data.fileStyle === 'angular' ? 'user.controller.ts' : 'user.ts'
                } controller`,
                `lts g service auth # Create a ${
                    data.fileStyle === 'angular' ? 'auth.service.ts' : 'auth.ts'
                } service`,
                `lts add jwt # Add JWT authentication`,
                `\`\`\``,
                ``,
                `### API Response Classes`,
                ``,
                `- **DataResponse**: Returns data with optional metadata.`,
                `\`\`\`typescript`,
                `import { DataResponse } from './core/responses';`,
                ``,
                `app.get('/users', (req, res) => {`,
                `  const users = [{ id: 1, name: 'John Doe' }];`,
                `  return new DataResponse(res, { data: users, message: 'Users retrieved' });`,
                `});`,
                `\`\`\``,
                ``,
                `- **MessageResponse**: Returns a message-only response.`,
                `\`\`\`typescript`,
                `import { MessageResponse } from './core/responses';`,
                ``,
                `app.delete('/users/:id', (req, res) => {`,
                `  return new MessageResponse(res, { message: 'User deleted' });`,
                `});`,
                `\`\`\``,
                ``,
                `### Error Classes`,
                ``,
                `Custom error classes for consistent HTTP error handling:`,
                `- BadRequestError (400)`,
                `- ConflictError (409)`,
                `- ForbiddenError (403)`,
                `- NotFoundError (404)`,
                `- ServerError (500)`,
                `- UnauthorizedError (401)`,
                ``,
                `\`\`\`typescript`,
                `import { BadRequestError } from './core/errors';`,
                ``,
                `app.post('/users', (req, res, next) => {`,
                `  if (!req.body.name) throw new BadRequestError('Name is required');`,
                `});`,
                `\`\`\``
            ]
        },
        {
            title: '## Configuration',
            content: [
                `Environment variables for application configuration are defined in a \`.env\` file.`,
                ``,
                `\`\`\`bash`,
                `# Environment`,
                `NODE_ENV=development`,
                ``,
                `# API Settings`,
                `PORT=8000`,
                `API_URL=http://localhost:8000/api`,
                `APP_URL=http://localhost:3000`,
                ``,
                ...(data.features.includes('database')
                    ? [
                          `# Database Connection`,
                          `DB_USER=your_username`,
                          `DB_NAME=your_database`,
                          `DB_PWD=your_password`,
                          `DB_HOST=localhost`,
                          `DB_PORT=5432`
                      ]
                    : []),
                ...(data.features.includes('jwt')
                    ? [
                          `# JWT Secrets`,
                          `ACCESS_JWT_SECRET=your_access_secret`,
                          `REFRESH_JWT_SECRET=your_refresh_secret`
                      ]
                    : []),
                `\`\`\``
            ]
        }
    ];

    // Map sections and normalize content
    const readMeContent: string = readMeSections
        .map((section) => [section.title, '', ...section.content, ''].join('\n'))
        .join('\n')
        .trim();

    fs.writeFileSync('ReadMe.md', readMeContent, { encoding: 'utf8', flag: 'w' });
};
