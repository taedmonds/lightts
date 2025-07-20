import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import ora from 'ora';
import { join } from 'path';
import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { DATABASE_DIR, pkgManagerCommands } from '../../config';
import { askDbType, askDummyData, askMigrations, askSeeders } from '../../init/prompts/database';
import { addDatabaseDummyTemplate } from '../../init/templates/features/database/dummy';
import { addDatabaseDataSourceTemplate } from '../../init/templates/features/database/root';
import { addDatabaseSeedersTemplate } from '../../init/templates/features/database/seeders';
import { getImportPath } from '../../utils';
import { updateLightTsConfigDatabase, updateLightTsConfigFeatures } from '../../utils/lightts';
import { updateConfigFile } from '../../utils/patch/config';
import { updateEnvFile } from '../../utils/patch/env';
import { fileExists } from '../../utils/project';

export const addDatabaseFeature = async (project: Project, data: AddCommandProps) => {
    const path = join(DATABASE_DIR);
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    const entitiesPath = join(path, 'entities');
    if (!existsSync(entitiesPath)) mkdirSync(entitiesPath, { recursive: true });

    // prompt for features
    const dbConfigs: DBConfigs = {
        dbType: 'none',
        seeders: false,
        migrations: false,
        dummyData: false
    };
    dbConfigs.dbType = await askDbType();
    dbConfigs.seeders = await askSeeders();
    dbConfigs.dummyData = await askDummyData();
    dbConfigs.migrations = await askMigrations();

    const addConfig: AddDatabaseCommandProps = {
        fileStyle: data.lightts.fileStyle,
        dbConfigs
    };

    const spinner = ora('Generating files...').start();
    // index file
    addDatabaseDataSourceTemplate(project, addConfig);

    // updating config.ts file
    spinner.text = 'Updating config.ts file';
    updateConfigFile(project, 'db', (writer) => {
        writer.newLine();
        writer.write('{').newLine();
        writer.write('user: process.env.DB_USER,').newLine();
        writer.write('name: process.env.DB_NAME,').newLine();
        writer.write('pwd: process.env.DB_PWD,').newLine();
        writer.write('host: process.env.DB_HOST,').newLine();
        writer.write('port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432').newLine();
        writer.write('}').newLine();
    });

    // updating .env
    spinner.text = 'Updating .env file';
    updateEnvFile([
        '# database',
        'DB_USER=your_username',
        'DB_NAME=your_database',
        'DB_PWD=your_password',
        'DB_HOST=localhost',
        'DB_PORT=5432'
    ]);

    // migrations
    if (dbConfigs.migrations) {
        spinner.text = 'Creating migrations folder';
        mkdirSync(join(path, 'migrations'), { recursive: true });
    }

    // seeders
    if (dbConfigs.seeders) {
        spinner.text = 'Creating seeders folder';
        mkdirSync(join(path, 'seeders/scripts'), { recursive: true });
        addDatabaseSeedersTemplate(project, addConfig);
    }

    // dummy
    if (dbConfigs.dummyData) {
        mkdirSync(join(path, 'dummy/scripts'), { recursive: true });
        spinner.text = 'Creating dummy folder';
        addDatabaseDummyTemplate(project, addConfig);
    }

    spinner.text = 'Updating index.ts file';
    // updating index.ts file
    const indexPath = 'index.ts';
    let indexFile: SourceFile;
    if (fileExists(indexPath)) {
        indexFile = project.addSourceFileAtPath(indexPath);
    } else {
        indexFile = project.createSourceFile(indexPath, '', { overwrite: true });
    }

    // updating imports
    const databaseImportPath = '@/database';
    const dbExistingImportPath = indexFile.getImportDeclaration(
        (imp) => imp.getModuleSpecifierValue() === databaseImportPath
    );
    if (!dbExistingImportPath) {
        indexFile.addImportDeclaration({
            namedImports: ['createConnection'],
            moduleSpecifier: databaseImportPath
        });
    }

    const logImportPath = getImportPath('logger', '@/core', 'core', data.lightts.fileStyle);
    const logExistingImportPath = indexFile.getImportDeclaration(
        (imp) => imp.getModuleSpecifierValue() === logImportPath
    );
    if (!logExistingImportPath) {
        indexFile.addImportDeclaration({
            defaultImport: 'log',
            moduleSpecifier: logImportPath
        });
    }

    // find the app.listen call
    const appListenCall = indexFile.getStatements().find((stmt) => {
        if (stmt.isKind(SyntaxKind.ExpressionStatement)) {
            const expr = stmt.getExpression();
            if (expr.isKind(SyntaxKind.CallExpression)) {
                const callExpr = expr.asKind(SyntaxKind.CallExpression);
                return (
                    callExpr?.getExpression().getText().startsWith('app.listen') &&
                    callExpr?.getArguments().some((arg) => arg.getText().includes('api.port'))
                );
            }
        }
        return false;
    });

    const connectionStatements = [
        '\n',
        'createConnection()',
        '.then(() => {',
        "log.info('Connected to database');",
        '})',
        '.catch((error) => {',
        "log.error('Error connecting to database:');",
        'log.error(error);',
        '});'
    ];
    if (appListenCall) {
        indexFile.insertStatements(appListenCall.getChildIndex(), connectionStatements);
    } else {
        indexFile.addStatements(connectionStatements);
    }
    indexFile.formatText();
    indexFile.saveSync();

    // install dependencies
    spinner.text = 'Installing dependencies';
    const dependencies = ['typeorm', 'typeorm-naming-strategies'];
    const devDependencies = [];

    const pkgCmd = pkgManagerCommands[data.lightts.package];
    switch (dbConfigs.dbType) {
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

    if (dbConfigs.dummyData) {
        devDependencies.push('faker');
    }

    // installing dependencies
    execSync(`${pkgCmd.install} ${dependencies.join(' ')}`, { stdio: 'ignore' });
    // installing dev dependencies
    if (devDependencies.length > 0)
        execSync(`${pkgCmd.install} ${devDependencies.join(' ')}`, { stdio: 'ignore' });

    spinner.text = 'Updating lightts config';
    updateLightTsConfigFeatures(['database']);
    updateLightTsConfigDatabase(dbConfigs);

    spinner.succeed('Feature is now onboard');
};
