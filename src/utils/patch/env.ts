import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export function updateEnvFile(envStatements: string[]) {
    const envFilePath = '.env';
    let existingContent = '';

    if (existsSync(envFilePath)) {
        existingContent = readFileSync(envFilePath, 'utf-8');
    }

    // Combine unique keys (optional: prevent overwriting)
    const newContent = existingContent.trim() + '\n' + envStatements.join('\n') + '\n';
    writeFileSync(envFilePath, newContent, 'utf-8');
}
