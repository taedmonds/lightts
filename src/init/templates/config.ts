import { join } from 'path';
import { CodeBlockWriter, Project, VariableDeclarationKind } from 'ts-morph';
import { ROOT_DIR } from '../../config';

const writeObject = (
    writer: CodeBlockWriter,
    key: string,
    obj: Record<string, any>,
    isLast: boolean
) => {
    writer.writeLine(`${key}: {`);
    writer.indent(() => {
        const entries = Object.entries(obj);
        entries.forEach(([key, value], index) => {
            if (typeof value === 'object' && value !== null) {
                writeObject(writer, key, value, index === entries.length - 1);
            } else {
                writer.writeLine(`${key}: ${value}${index < entries.length - 1 ? ',' : ''}`);
            }
        });
    });
    writer.writeLine(`}${isLast ? '' : ','}`);
};

export const generateConfigFile = (project: Project, data: PromptConfig) => {
    const sourceFile = project.createSourceFile(join(ROOT_DIR, 'config.ts'), '', {
        overwrite: true
    });

    // dotenv import
    sourceFile.addImportDeclaration({
        namespaceImport: 'dotenv',
        moduleSpecifier: 'dotenv'
    });

    // dotenv config
    sourceFile.addStatements('dotenv.config();');

    // build the config object
    const configObject: Record<string, any> = {
        env: `process.env.NODE_ENV || 'production'`,
        api: {
            port: `process.env.PORT || 8000`,
            version: `'v1'`,
            url: `process.env.API_URL`
        },
        app: {
            url: `process.env.APP_URL`
        }
    };

    // add database configs
    if (data.features.includes('database')) {
        configObject.db = {
            user: `process.env.DB_USER`,
            name: `process.env.DB_NAME`,
            pwd: `process.env.DB_PWD`,
            host: `process.env.DB_HOST`,
            port: `process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432`
        };
    }

    // add jwt configs
    if (data.features.includes('jwt')) {
        configObject.auth = {
            salt: 10,
            jwt: {
                access: {
                    secret: `process.env.ACCESS_JWT_SECRET`,
                    expiresIn: `'15m'`
                },
                refresh: {
                    secret: `process.env.REFRESH_JWT_SECRET`,
                    expiresIn: `'30d'`
                }
            }
        };
    }

    // export keys
    const exportedKeys = ['env', 'api', 'app'];
    if (configObject.db) exportedKeys.push('db');
    if (configObject.auth) exportedKeys.push('auth');

    // Add config object with recursive writer
    sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
            {
                name: `{ ${exportedKeys.join(', ')} }`,
                initializer: (writer: CodeBlockWriter) => {
                    writer.writeLine('{');
                    writer.indent(() => {
                        Object.entries(configObject).forEach(([key, value], index) => {
                            if (typeof value === 'object' && value !== null) {
                                writeObject(
                                    writer,
                                    key,
                                    value,
                                    index === Object.keys(configObject).length - 1
                                );
                            } else {
                                writer.writeLine(
                                    `${key}: ${value}${index < Object.keys(configObject).length - 1 ? ',' : ''}`
                                );
                            }
                            if (index < Object.keys(configObject).length - 1) writer.writeLine('');
                        });
                    });
                    writer.write('}');
                }
            }
        ]
    });
};
