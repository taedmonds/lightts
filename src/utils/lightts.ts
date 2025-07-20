import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { DEFAULT_LITETS_CONFIG, LITETS_DIR } from '../config';

export const getLiteTsConfig = (): LiteTsConfig => {
    const configPath = path.resolve(process.cwd(), LITETS_DIR, 'config.json');
    const spinner = ora('Loading lightTs config...').start();
    let configFromFile: Partial<LiteTsConfig> = {};

    try {
        if (fs.existsSync(configPath)) {
            const raw = fs.readFileSync(configPath, 'utf-8');
            configFromFile = JSON.parse(raw);
            spinner.succeed('Loaded config from LightTs config');
        } else {
            spinner.warn(`${LITETS_DIR}/config.json not found. Using default config.`);
        }
    } catch (err) {
        spinner.fail('Failed to parse LightTs config');
    }

    return {
        ...DEFAULT_LITETS_CONFIG,
        ...configFromFile
    };
};

export const updateLiteTsConfigFeatures = (features: Features[]) => {
    const configPath = path.resolve(process.cwd(), LITETS_DIR, 'config.json');
    let configFromFile: Partial<LiteTsConfig> = {};

    if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        configFromFile = JSON.parse(raw);
    }

    configFromFile.features = configFromFile.features?.concat(features);

    const config = JSON.stringify(
        {
            ...DEFAULT_LITETS_CONFIG,
            ...configFromFile
        },
        null,
        2
    );
    fs.writeFileSync(configPath, config);
};

export const updateLiteTsConfigDatabase = (dbConfigs: DBConfigs) => {
    const configPath = path.resolve(process.cwd(), LITETS_DIR, 'config.json');
    let configFromFile: Partial<LiteTsConfig> = {};

    if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        configFromFile = JSON.parse(raw);
    }

    configFromFile.dbConfigs = { ...configFromFile.dbConfigs, ...dbConfigs };

    const config = JSON.stringify(
        {
            ...DEFAULT_LITETS_CONFIG,
            ...configFromFile
        },
        null,
        2
    );
    fs.writeFileSync(configPath, config);
};
