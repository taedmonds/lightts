import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import ora from 'ora';
import { pkgManagerCommands } from '../../config';

export const generatePackageJson = (data: PromptConfig): string => {
    const spinner = ora('Generating package.json').start();
    try {
        const packageJson: PackageJSON = {
            name: data.name,
            version: '1.0.0',
            description: 'A Node.js API project',
            main: 'dist/index.js',
            scripts: {
                start: 'node dist/index.js',
                dev: 'nodemon --exec ts-node index.ts',
                typeorm: 'npx tsx -r tsconfig-paths/register ./node_modules/typeorm/cli.js',
                migrate: 'npm run typeorm migration:run -- -d ./src/database/index.ts',
                seed: 'npm run typeorm migration:run -- -d ./src/database/seeders/index.ts',
                dummy: 'npm run typeorm migration:run -- -d ./src/database/dummy/index.ts',
                build: 'rimraf dist && tsc && tsc-alias',
                'build:migrate': 'npm run typeorm migration:run -- -d ./dist/src/database/index.js',
                'build:seed':
                    'npm run typeorm migration:run -- -d ./dist/src/database/seeders/index.js'
            },
            license: 'MIT'
        };

        if (data.lintConfigs.includes('eslint')) {
            packageJson.scripts.lint = 'eslint . --ext .ts';
            packageJson.scripts['lint:fix'] = 'eslint . --ext .ts --fix';
        }

        if (data.lintConfigs.includes('prettier')) {
            packageJson.scripts.format = 'prettier --write "src/**/*.{ts,js,json}"';
        }

        if (data.lintConfigs.includes('husky')) {
            packageJson.scripts.prepare = 'husky';
            packageJson.husky = {
                hooks: {
                    'pre-commit': 'lint-staged'
                }
            };
            packageJson['lint-staged'] = {
                '*.{js,ts,json,md}': ['prettier --write']
            };
            if (data.lintConfigs.includes('eslint')) {
                packageJson['lint-staged']['*.{js,ts,json,md}'].push('eslint --fix');
            }
        }

        const jsonStr = JSON.stringify(packageJson, null, 2);
        writeFileSync('package.json', jsonStr);
        spinner.succeed('package.json created');
        return jsonStr;
    } catch (error) {
        spinner.fail('Failed to create package.json');
        throw error;
    }
};

export const installDependencies = (data: PromptConfig) => {
    const spinner = ora('Installing dependencies').start();

    try {
        const dependencies = ['express', 'pino', 'pino-pretty', 'tsconfig-paths'];
        const devDependencies = [
            'typescript',
            'ts-node',
            'tsc-alias',
            'nodemon',
            '@types/express',
            '@types/node',
            'rimraf'
        ];

        if (data.features.includes('jwt')) {
            dependencies.push('jsonwebtoken');
            devDependencies.push('@types/jsonwebtoken');
        }
        if (data.features.includes('cors')) {
            dependencies.push('cors');
            devDependencies.push('@types/cors');
        }
        if (data.features.includes('validation')) {
            dependencies.push('joi');
        }
        if (data.features.includes('database')) {
            dependencies.push('typeorm');
            dependencies.push('typeorm-naming-strategies');
            switch (data.dbConfigs.dbType) {
                case 'postgres':
                    dependencies.push('pg');
                    break;
                case 'mysql':
                    dependencies.push('mysql2');
                    break;
                case 'mariadb':
                    dependencies.push('mariadb');
                    break;
                case 'mongodb':
                    dependencies.push('mongodb');
                    break;
            }
        }

        if (data.dbConfigs.dummyData) {
            devDependencies.push('faker');
        }
        if (data.lintConfigs.includes('eslint')) {
            devDependencies.push(
                '@typescript-eslint/eslint-plugin',
                '@typescript-eslint/parser',
                'eslint'
            );
        }
        if (data.lintConfigs.includes('prettier')) {
            devDependencies.push('prettier', 'eslint-config-prettier', 'eslint-plugin-prettier');
        }
        if (data.lintConfigs.includes('husky')) {
            devDependencies.push('husky', 'lint-staged');
        }

        const pkgCmd = pkgManagerCommands[data.pkg];

        if (dependencies.length) {
            spinner.text = 'Installing dependencies...';
            execSync(`${pkgCmd.install} ${dependencies.join(' ')}`, { stdio: 'ignore' });
        }

        if (devDependencies.length) {
            spinner.text = 'Installing dev dependencies...';
            execSync(`${pkgCmd.dev} ${devDependencies.join(' ')}`, { stdio: 'ignore' });
        }

        spinner.succeed('Dependencies installed successfully');
    } catch (error) {
        spinner.fail('Failed to install dependencies');
        throw error;
    }
};
