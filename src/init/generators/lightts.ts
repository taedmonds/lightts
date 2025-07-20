import { mkdirSync, writeFileSync } from 'fs';
import ora from 'ora';
import { join } from 'path';
import { LITETS_DIR } from '../../config';

export const configureLiteTS = (data: PromptConfig): string => {
    const spinner = ora('Configuring LiteTS').start();
    try {
        mkdirSync(LITETS_DIR, { recursive: true });

        const configs: LiteTsConfig = {
            name: data.name,
            fileStyle: data.fileStyle,
            package: data.pkg,
            features: data.features,
            dbConfigs: data.dbConfigs
        };

        const configPath = join(LITETS_DIR, 'config.json');
        const config = JSON.stringify(configs, null, 2);

        writeFileSync(configPath, config);

        spinner.succeed('LiteTS configured');
        return config;
    } catch (error) {
        spinner.fail('Failed to configure LiteTS');
        throw error;
    }
};
