import { join } from 'path';
import { Project, SourceFile } from 'ts-morph';
import { fileExists } from '../project';

export function updatePackageJSONFile(project: Project, data: PackageJSONPatchData) {
    const packageJsonPath = join('package.json');
    let packageJsonFile: SourceFile;

    // load existing package.json or create a new one
    if (fileExists(packageJsonPath)) {
        packageJsonFile = project.addSourceFileAtPath(packageJsonPath);
    } else {
        packageJsonFile = project.createSourceFile(packageJsonPath, '{}', { overwrite: true });
    }

    // parse existing content or initialize empty object
    let packageJsonContent: { [key: string]: any } = {};
    try {
        packageJsonContent = JSON.parse(packageJsonFile.getText() || '{}');
    } catch (error) {
        console.error('Error parsing package.json, initializing empty object:', error);
    }

    // merge append data into package.json content
    if (data.append) {
        for (const [key, value] of Object.entries(data.append)) {
            if (typeof value === 'object') {
                packageJsonContent[key] = {
                    ...packageJsonContent[key],
                    ...value
                };
            } else {
                packageJsonContent[key] = value;
            }
        }
    }

    const packageJsonText = JSON.stringify(packageJsonContent, null, 2);
    packageJsonFile.replaceWithText(packageJsonText);

    packageJsonFile.formatText();
    packageJsonFile.saveSync();
}
