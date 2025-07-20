import { mkdirSync, writeFileSync } from 'fs';
import ora from 'ora';
import { join } from 'path';
import { LIGHTTS_DIR } from '../../config';

export const configureLightTS = (data: PromptConfig): string => {
    const spinner = ora('Configuring LightTs').start();
    try {
        mkdirSync(LIGHTTS_DIR, { recursive: true });

        const configs: LightTsConfig = {
            name: data.name,
            fileStyle: data.fileStyle,
            package: data.pkg,
            features: data.features,
            dbConfigs: data.dbConfigs
        };

        const configPath = join(LIGHTTS_DIR, 'config.json');
        const config = JSON.stringify(configs, null, 2);

        writeFileSync(configPath, config);

        spinner.succeed('LightTs configured');
        return config;
    } catch (error) {
        spinner.fail('Failed to configure LightTs');
        throw error;
    }
};
