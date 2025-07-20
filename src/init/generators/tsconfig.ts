import { writeFileSync } from 'fs';
import ora from 'ora';

export const generateTSConfig = () => {
    const spinner = ora('Creating tsconfig.json').start();
    try {
        const tsconfig = {
            compilerOptions: {
                target: 'ES2020',
                module: 'CommonJs',
                moduleResolution: 'node',
                esModuleInterop: true,
                strict: false,
                forceConsistentCasingInFileNames: true,
                skipLibCheck: true,
                outDir: 'dist',
                rootDir: '.',
                baseUrl: '.',
                typeRoots: ['./node_modules/@types', './src/types'],
                paths: {
                    '@/*': ['src/*']
                }
            },
            'ts-node': {
                files: true,
                transpileOnly: true,
                require: ['tsconfig-paths/register']
            },
            include: ['src/**/*', 'index.ts'],
            exclude: ['node_modules', 'dist']
        };

        writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
        spinner.succeed('tsconfig.json created');
    } catch (error) {
        spinner.fail('Failed to create tsconfig.json');
        throw error;
    }
};
