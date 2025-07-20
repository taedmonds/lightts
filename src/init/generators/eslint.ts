import ora from 'ora';
import { copyTemplateFile } from '../../utils';

export const generateESLint = () => {
    const spinner = ora('Creating ESLint configuration').start();
    try {
        copyTemplateFile({ filename: 'eslint.config.js' });

        spinner.succeed('eslint.config.js created');
    } catch (error) {
        spinner.fail('Failed to create ESLint config');
        throw error;
    }
};
