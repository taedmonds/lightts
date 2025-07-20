import { execSync } from 'node:child_process';
import ora from 'ora';
import { copyTemplateFile } from '../../utils';

export const initGitRepo = () => {
    const spinner = ora('Initializing Git repository').start();
    try {
        execSync('git init', { stdio: 'ignore' });

        copyTemplateFile({ filename: 'dot-gitignore', destination: '.gitignore' });

        spinner.succeed('Git initialized');
    } catch (error) {
        spinner.fail('Failed to initialize Git');
        throw error;
    }
};
