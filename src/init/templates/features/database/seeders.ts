import { join } from 'path';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { DATABASE_DIR } from '../../../../config';

export const addDatabaseSeedersTemplate = (project: Project, data: AddDatabaseCommandProps) => {
    const sourceFile = project.createSourceFile(join(DATABASE_DIR, 'seeders', 'index.ts'), '', {
        overwrite: true
    });

    sourceFile.addImportDeclaration({
        namedImports: ['db'],
        moduleSpecifier: '@/config'
    });

    sourceFile.addImportDeclaration({
        defaultImport: 'path',
        moduleSpecifier: 'path'
    });

    sourceFile.addImportDeclaration({
        namedImports: ['DataSource'],
        moduleSpecifier: 'typeorm'
    });

    sourceFile.addImportDeclaration({
        namedImports: ['SnakeNamingStrategy'],
        moduleSpecifier: 'typeorm-naming-strategies'
    });

    sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
            {
                name: 'seedsDatasource',
                initializer: (writer) => {
                    writer.write('new DataSource({\n');
                    writer.write(`type: '${data.dbConfigs.dbType}',\n`);
                    writer.write('host: db.host,\n');
                    writer.write('port: db.port,\n');
                    writer.write('username: db.user,\n');
                    writer.write('password: db.pwd,\n');
                    writer.write('database: db.name,\n');
                    writer.write('synchronize: false,\n');
                    writer.write('logging: false,\n');
                    writer.write(
                        "entities: [path.join(__dirname, '../entities/**/*.entity.{ts,js}')],\n"
                    );
                    writer.write("migrations: [path.join(__dirname, '/scripts/**/*.{ts,js}')],\n");
                    writer.write('subscribers: [],\n');
                    writer.write(`migrationsTableName: 'migration_seeders',\n`);
                    writer.write('namingStrategy: new SnakeNamingStrategy(),\n');
                    writer.write('});');
                    writer.write('\n');
                }
            }
        ]
    });

    sourceFile.saveSync();
};
