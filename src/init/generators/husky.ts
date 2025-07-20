import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import ora from 'ora';

export const generateHusky = (pkgManager: PKGTypes) => {
    const spinner = ora('Setting up Husky').start();
    try {
        const prepareCommand = {
            npm: 'npm run prepare',
            yarn: 'yarn prepare',
            pnpm: 'pnpm prepare'
        }[pkgManager];

        if (!existsSync('.husky')) mkdirSync('.husky');
        execSync(prepareCommand, { stdio: 'ignore' });

        writeFileSync('.husky/pre-commit', 'npx lint-staged');

        spinner.succeed('Husky configured');
    } catch (error) {
        spinner.fail('Failed to setup Husky');
        throw error;
    }
};
