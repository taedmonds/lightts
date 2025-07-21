import { Project, VariableDeclarationKind } from 'ts-morph';
import { getImportPath } from '../../utils';

export const generateIndexFile = (project: Project, data: PromptConfig) => {
    const sourceFile = project.createSourceFile('index.ts', '', { overwrite: true });

    // error express
    sourceFile.addImportDeclaration({
        defaultImport: 'express',
        moduleSpecifier: 'express'
    });
    // error formatter
    sourceFile.addImportDeclaration({
        namedImports: ['HttpError'],
        moduleSpecifier: '@/core/errors'
    });
    // config
    sourceFile.addImportDeclaration({
        namedImports: ['api'],
        moduleSpecifier: '@/config'
    });
    // logger
    sourceFile.addImportDeclaration({
        defaultImport: 'log',
        moduleSpecifier: getImportPath('logger', '@/core', 'core', data.fileStyle)
    });
    // routes
    sourceFile.addImportDeclaration({
        defaultImport: 'routes',
        moduleSpecifier: '@/routes'
    });

    // cors
    if (data.features.includes('cors')) {
        sourceFile.addImportDeclaration({
            defaultImport: 'cors',
            moduleSpecifier: 'cors'
        });
        sourceFile.addImportDeclaration({
            namedImports: ['checkCorsOrigin'],
            moduleSpecifier: getImportPath('cors', '@/core', 'core', data.fileStyle)
        });
    }

    // database
    if (data.features.includes('database')) {
        sourceFile.addImportDeclaration({
            namedImports: ['createConnection'],
            moduleSpecifier: '@/database'
        });
    }
    // ts-alias
    sourceFile.addImportDeclaration({
        moduleSpecifier: 'tsconfig-paths/register'
    });

    // express app & configs
    sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
            {
                name: 'app',
                initializer: 'express()'
            }
        ]
    });

    sourceFile.addStatements([
        '\n',
        '# express configurations',
        'app.use(express.json());',
        'app.use(express.urlencoded({ extended: true }));'
    ]);

    // add cors & configs
    if (data.features.includes('cors')) {
        sourceFile.addStatements(['\n', 'app.use(cors());']);

        sourceFile.addStatements((writer) => {
            writer
                .write('# cors')
                .write('app.use(')
                .newLine()
                .write('cors({')
                .newLine()
                .write('origin: checkCorsOrigin,')
                .newLine()
                .write('credentials: true')
                .newLine()
                .write(' })')
                .newLine()
                .write(' );');
        });
    }

    // database connection function
    if (data.features.includes('database')) {
        sourceFile.addStatements((writer) => {
            writer
                .write('\n')
                .write('# database connection')
                .write('createConnection()')
                .newLine()
                .write('.then(() => {')
                .newLine()
                .write("log.info('Connected to database');")
                .newLine()
                .write('})')
                .newLine()
                .write('.catch((error) => {')
                .newLine()
                .write("log.error('Error connecting to database:');")
                .newLine()
                .write('log.error(error);')
                .newLine()
                .write('});');
        });
    }

    // api routes and error handler
    sourceFile.addStatements([
        '\n',
        '# http routes',
        'app.use(`/api/${api.version}`, routes);',
        '\n',
        '# http error class handler',
        'app.use(HttpError.middleware);'
    ]);
    // express listner
    sourceFile.addStatements((writer) => {
        writer
            .write('\n')
            .write('app.listen(api.port, () => {')
            .newLine()
            .write('log.info(`Listening on port: ${api.port}`);')
            .newLine()
            .write('});');
    });
};
