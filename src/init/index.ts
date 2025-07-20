import { ASCII_LOGO } from '../config';
import { generateESLint } from './generators/eslint';
import { initGitRepo } from './generators/git';
import { generateHusky } from './generators/husky';
import { configureLiteTS } from './generators/lightts';
import { generatePackageJson, installDependencies } from './generators/package-json';
import { generatePrettier } from './generators/prettier';
import { generateTSConfig } from './generators/tsconfig';
import { prompts } from './prompts';
import { generateTemplate } from './templates';

export const init = async () => {
    const data = await prompts();

    generatePackageJson(data);
    installDependencies(data);
    configureLiteTS(data);
    generateTemplate(data);
    generateTSConfig();
    initGitRepo();

    if (data.lintConfigs.includes('prettier')) {
        generatePrettier();
    }

    if (data.lintConfigs.includes('eslint')) {
        generateESLint();
    }

    if (data.lintConfigs.includes('husky')) {
        generateHusky(data.pkg);
    }

    console.log(ASCII_LOGO);
    console.log('{ Happy Coding with LightTs! }');
};
