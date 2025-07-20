import { join } from 'path';
import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { ROOT_DIR } from '../../config';
import { fileExists } from '../project';

export function updateConfigFile(
    project: Project,
    propertyName: string,
    initializer: string | ((writer: any) => void)
) {
    const configPath = join(ROOT_DIR, 'config.ts');
    let configFile: SourceFile;

    if (fileExists(configPath)) {
        configFile = project.addSourceFileAtPath(configPath);
    } else {
        configFile = project.createSourceFile(configPath, '', { overwrite: true });
    }

    const exportStatement = configFile
        .getStatements()
        .find((stmt) => {
            if (stmt.isKind(SyntaxKind.VariableStatement)) {
                const declaration = stmt.getDeclarations()[0];
                return (
                    declaration?.getNameNode().isKind(SyntaxKind.ObjectBindingPattern) &&
                    declaration.getInitializer()?.isKind(SyntaxKind.ObjectLiteralExpression) &&
                    stmt.hasExportKeyword()
                );
            }
            return false;
        })
        ?.asKind(SyntaxKind.VariableStatement);

    if (!exportStatement) {
        throw new Error('could not find export statement with object destructuring in config.ts');
    }

    // update the destructured export to include the new property
    const declaration = exportStatement.getDeclarations()[0];
    const bindingPattern = declaration.getNameNode()?.asKind(SyntaxKind.ObjectBindingPattern);
    if (!bindingPattern) {
        throw new Error('could not find binding pattern in export statement');
    }

    const objectLiteral = declaration.getInitializer()?.asKind(SyntaxKind.ObjectLiteralExpression);
    if (!objectLiteral) {
        throw new Error('could not find object literal in export statement');
    }

    // check if the property already exists
    const existingProperty = objectLiteral.getProperty(propertyName);
    if (!existingProperty) {
        objectLiteral.addPropertyAssignment({
            name: propertyName,
            initializer: initializer
        });
    }

    const exportText = exportStatement.getText();
    const updatedExportText = exportText.replace(
        /export const \{([^}]*)\}/,
        `export const { $1, ${propertyName} }`
    );
    exportStatement.replaceWithText(updatedExportText);

    configFile.formatText();
    configFile.saveSync();
}
