import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { DEFAULT_LIGHTTS_CONFIG, LIGHTTS_DIR } from '../config';

export const getLightTsConfig = (): LightTsConfig => {
    const configPath = path.resolve(process.cwd(), LIGHTTS_DIR, 'config.json');
    const spinner = ora('Loading lightTs config...').start();
    let configFromFile: Partial<LightTsConfig> = {};

    try {
        if (fs.existsSync(configPath)) {
            const raw = fs.readFileSync(configPath, 'utf-8');
            configFromFile = JSON.parse(raw);
            spinner.succeed('Loaded config from LightTs config');
        } else {
            spinner.warn(`${LIGHTTS_DIR}/config.json not found. Using default config.`);
        }
    } catch (err) {
        spinner.fail('Failed to parse LightTs config');
    }

    return {
        ...DEFAULT_LIGHTTS_CONFIG,
        ...configFromFile
    };
};

export const updateLightTsConfigFeatures = (features: Features[]) => {
    const configPath = path.resolve(process.cwd(), LIGHTTS_DIR, 'config.json');
    let configFromFile: Partial<LightTsConfig> = {};

    if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        configFromFile = JSON.parse(raw);
    }

    configFromFile.features = configFromFile.features?.concat(features);

    const config = JSON.stringify(
        {
            ...DEFAULT_LIGHTTS_CONFIG,
            ...configFromFile
        },
        null,
        2
    );
    fs.writeFileSync(configPath, config);
};

export const updateLightTsConfigDatabase = (dbConfigs: DBConfigs) => {
    const configPath = path.resolve(process.cwd(), LIGHTTS_DIR, 'config.json');
    let configFromFile: Partial<LightTsConfig> = {};

    if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        configFromFile = JSON.parse(raw);
    }

    configFromFile.dbConfigs = { ...configFromFile.dbConfigs, ...dbConfigs };

    const config = JSON.stringify(
        {
            ...DEFAULT_LIGHTTS_CONFIG,
            ...configFromFile
        },
        null,
        2
    );
    fs.writeFileSync(configPath, config);
};
