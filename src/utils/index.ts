import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';

export const copyTemplateFile = ({
    filename,
    targetFolder = 'common',
    sourceFolder = 'templates',
    destination = filename,
    fileStyle
}: {
    filename: string;
    targetFolder?: string;
    sourceFolder?: string;
    destination?: string;
    fileStyle?: FileStyle;
}) => {
    if (fileStyle) sourceFolder = join(sourceFolder, fileStyle);
    const sourcePath = join(__dirname, sourceFolder, targetFolder, filename);
    const content = readFileSync(sourcePath, 'utf-8');

    writeFileSync(destination, content);
};

const singularize = (name: string): string => {
    return name.endsWith('s') ? name.slice(0, -1) : name;
};

const copyFolderWithRename = (src: string, dest: string, parentFolder: string) => {
    mkdirSync(dest, { recursive: true });

    const items = readdirSync(src, { withFileTypes: true });

    for (const item of items) {
        const srcItemPath = join(src, item.name);
        let destItemPath = join(dest, item.name);

        if (item.isDirectory()) {
            copyFolderWithRename(srcItemPath, destItemPath, item.name);
        } else {
            const ext = extname(item.name);
            const base = basename(item.name, ext);
            const singularParent = singularize(parentFolder);

            destItemPath = join(
                dest,
                base !== 'index' ? `${base}.${singularParent}${ext}` : item.name
            );

            const content = readFileSync(srcItemPath);
            writeFileSync(destItemPath, content);
        }
    }
};

export const copyTemplateFolder = ({
    folder,
    targetFolder = 'common',
    sourceFolder = 'templates',
    destination = folder,
    fileStyle,
    searchFileStyleFolder = true,
    renameOnAngular = false
}: {
    folder: string;
    targetFolder?: string;
    sourceFolder?: string;
    destination?: string;
    fileStyle?: FileStyle;
    searchFileStyleFolder?: boolean;
    renameOnAngular?: boolean;
}) => {
    const sourceDir =
        fileStyle && searchFileStyleFolder ? join(sourceFolder, fileStyle) : sourceFolder;
    const sourcePath = join(__dirname, sourceDir, targetFolder, folder);

    if (fileStyle === 'angular' && renameOnAngular) {
        copyFolderWithRename(sourcePath, destination, folder);
    } else {
        cpSync(sourcePath, destination, { recursive: true });
    }
};

export const getImportPath = (
    name: string,
    path: string,
    type: string,
    fileStyle: FileStyle = 'regular',
    returnType: boolean = false
): string => {
    if (fileStyle == 'angular') {
        return join(path, `${name}.${type}`);
    }

    return join(path, returnType ? type : name);
};

export const getFileName = (
    name: string,
    type: string,
    fileStyle: FileStyle = 'regular',
    extension?: string,
    returnType: boolean = false
): string => {
    if (fileStyle == 'angular') return `${name}.${type}` + (extension ? `.${extension}` : '');

    return (returnType ? type : name) + (extension ? `.${extension}` : '');
};
