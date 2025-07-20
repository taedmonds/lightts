import ora from 'ora';
import { copyTemplateFile } from '../../utils';

export const generatePrettier = () => {
    const spinner = ora('Creating Prettier configuration').start();
    try {
        copyTemplateFile({ filename: '.prettierrc' });
        copyTemplateFile({ filename: '.prettierignore' });

        spinner.succeed('Prettier config created');
    } catch (error) {
        spinner.fail('Failed to create Prettier config');
        throw error;
    }
};
