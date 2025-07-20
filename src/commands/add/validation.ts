import { execSync } from 'child_process';
import ora from 'ora';
import { pkgManagerCommands } from '../../config';
import { addValidationTemplate } from '../../init/templates/features/validation';
import { updateLiteTsConfigFeatures } from '../../utils/lightts';

export const addValidationFeature = (data: AddCommandProps) => {
    const spinner = ora('Generating files...').start();
    // add cors template
    addValidationTemplate({ fileStyle: data.lightts.fileStyle });

    spinner.text = 'Installing dependencies';
    // install dependencies
    const dependencies = ['joi'];

    const pkgCmd = pkgManagerCommands[data.lightts.package];

    // installing dependencies
    execSync(`${pkgCmd.install} ${dependencies.join(' ')}`, { stdio: 'ignore' });

    spinner.text = 'Update lightts config';
    // add feature to lightts config
    updateLiteTsConfigFeatures(['validation']);

    spinner.succeed('Feature is now onboard');
};
