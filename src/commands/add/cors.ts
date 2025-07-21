import { execSync } from 'child_process';
import ora from 'ora';
import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { pkgManagerCommands } from '../../config';
import { addCorsTemplate } from '../../init/templates/features/cors';
import { getImportPath } from '../../utils';
import { updateLightTsConfigFeatures } from '../../utils/lightts';
import { fileExists } from '../../utils/project';

export const addCorsFeature = (project: Project, data: AddCommandProps) => {
    const spinner = ora('Generating files...').start();
    // add cors template
    addCorsTemplate({ fileStyle: data.lightts.fileStyle });

    spinner.text = 'Updating index.ts file';
    const indexPath = 'index.ts';
    let indexFile: SourceFile;
    if (fileExists(indexPath)) {
        indexFile = project.addSourceFileAtPath(indexPath);
    } else {
        indexFile = project.createSourceFile(indexPath, '', { overwrite: true });
    }

    // add cors module
    const corsExistingImportPath = indexFile.getImportDeclaration(
        (imp) => imp.getModuleSpecifierValue() === 'cors'
    );
    if (!corsExistingImportPath) {
        indexFile.addImportDeclaration({
            defaultImport: 'cors',
            moduleSpecifier: 'cors'
        });
    }

    // add core cors
    const corsCheckImportPath = getImportPath('cors', '@/core', 'core', data.lightts.fileStyle);
    const corsFileExistingImportPath = indexFile.getImportDeclaration(
        (imp) => imp.getModuleSpecifierValue() === corsCheckImportPath
    );
    if (!corsFileExistingImportPath) {
        indexFile.addImportDeclaration({
            namedImports: ['checkCorsOrigin'],
            moduleSpecifier: corsCheckImportPath
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

    // add cors origin checkCorsOrigin
    const corsStatements = [
        '\n',
        '# cors',
        'app.use(cors());',
        'app.use(',
        'cors({',
        'origin: checkCorsOrigin,',
        'credentials: true',
        '})',
        ');'
    ];
    if (appListenCall) {
        indexFile.insertStatements(appListenCall.getChildIndex(), corsStatements);
    } else {
        indexFile.addStatements(corsStatements);
    }
    indexFile.saveSync();

    spinner.text = 'Installing dependencies';
    // install dependencies
    const dependencies = ['cors'];
    const devDependencies = ['@types/cors'];

    const pkgCmd = pkgManagerCommands[data.lightts.package];

    // installing dependencies
    execSync(`${pkgCmd.install} ${dependencies.join(' ')}`, { stdio: 'ignore' });
    // installing dev dependencies
    execSync(`${pkgCmd.install} ${devDependencies.join(' ')}`, { stdio: 'ignore' });

    // add feature to lightts config
    spinner.text = 'Update lightts config';
    updateLightTsConfigFeatures(['cors']);

    spinner.succeed('Feature is now onboard');
};
