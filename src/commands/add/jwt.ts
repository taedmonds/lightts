import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import ora from 'ora';
import { join } from 'path';
import { Project } from 'ts-morph';
import { pkgManagerCommands, TYPES_DIR } from '../../config';
import { addJWTTemplate } from '../../init/templates/features/jwt';
import { copyTemplateFile, getFileName } from '../../utils';
import { updateLiteTsConfigFeatures } from '../../utils/lightts';
import { updateConfigFile } from '../../utils/patch/config';
import { updateEnvFile } from '../../utils/patch/env';

export const addJWTFeature = (project: Project, data: AddCommandProps) => {
    const spinner = ora('Generating files...').start();
    // add cors template
    addJWTTemplate({ fileStyle: data.lightts.fileStyle });

    // updating config.ts file
    spinner.text = 'Updating config.ts file';
    updateConfigFile(project, 'auth', (writer) => {
        writer.write('{').newLine();
        writer.write('salt: 10,').newLine();
        writer.write('jwt: {').newLine();
        writer.write('access: {').newLine();
        writer.write('secret: process.env.ACCESS_JWT_SECRET,').newLine();
        writer.write('expiresIn: "15m"').newLine();
        writer.write('},').newLine();
        writer.write('refresh: {').newLine();
        writer.write('secret: process.env.REFRESH_JWT_SECRET,').newLine();
        writer.write('expiresIn: "30d"').newLine();
        writer.write('}').newLine();
        writer.write('}').newLine();
        writer.write('}');
    });

    // update .env file
    spinner.text = 'Updating .env file';
    updateEnvFile([
        '# jwt',
        'ACCESS_JWT_SECRET=your_access_secret',
        'REFRESH_JWT_SECRET=your_refresh_secret'
    ]);

    // add types
    spinner.text = 'Adding types file';
    const path = join(TYPES_DIR);
    mkdirSync(path, { recursive: true });
    // copy express
    copyTemplateFile({
        filename: 'express.ts',
        targetFolder: 'types',
        destination: join(path, getFileName('express.d', 'type', 'regular', 'ts'))
    });

    spinner.text = 'Installing dependencies';
    // install dependencies
    const dependencies = ['jsonwebtoken'];
    const devDependencies = ['@types/jsonwebtoken'];

    const pkgCmd = pkgManagerCommands[data.lightts.package];

    // installing dependencies
    execSync(`${pkgCmd.install} ${dependencies.join(' ')}`, { stdio: 'ignore' });
    // installing dev dependencies
    execSync(`${pkgCmd.install} ${devDependencies.join(' ')}`, { stdio: 'ignore' });

    spinner.text = 'Update lightts config';
    // add feature to lightts config
    updateLiteTsConfigFeatures(['jwt']);

    spinner.succeed('Feature is now onboard');
};
