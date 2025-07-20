import { join } from 'path';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { ROOT_DIR } from '../../config';
import { getImportPath } from '../../utils';

export const generateRoutesFile = (project: Project, data: PromptConfig) => {
    const sourceFile = project.createSourceFile(join(ROOT_DIR, 'routes.ts'), '', {
        overwrite: true
    });

    sourceFile.addImportDeclaration({
        defaultImport: 'express',
        moduleSpecifier: 'express'
    });
    sourceFile.addImportDeclaration({
        defaultImport: 'helloController',
        moduleSpecifier: getImportPath(
            'hello',
            '@/modules/hello',
            'controller',
            data.fileStyle,
            true
        )
    });

    sourceFile.addStatements(['\n']);
    sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
            {
                name: 'router',
                initializer: 'express.Router()'
            }
        ]
    });

    sourceFile.addStatements(['\n', "router.use('/hello', helloController);", '\n']);

    sourceFile.addExportAssignment({
        isExportEquals: false,
        expression: 'router'
    });
};
