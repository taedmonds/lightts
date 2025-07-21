// constants
export const ROOT_DIR = 'src';
export const LIGHTTS_DIR = '.lightts';

export const CORE_DIR = `${ROOT_DIR}/core`;
export const MODULES_DIR = `${ROOT_DIR}/modules`;
export const MIDDLEWARE_DIR = `${ROOT_DIR}/middleware`;
export const DATABASE_DIR = `${ROOT_DIR}/database`;
export const TYPES_DIR = `${ROOT_DIR}/types`;

export const DEFAULT_LIGHTTS_CONFIG: LightTsConfig = {
    name: 'epic-api',
    fileStyle: 'angular',
    package: 'npm',
    features: [],
    dbConfigs: {
        dbType: 'none',
        dummyData: false,
        seeders: false,
        migrations: false
    }
};

export const ASCII_LOGO = `
   __   _      __   __ ______  
  / /  (_)__ _/ /  / //_  __/__
 / /__/ / _  / _ \\/ __// / (_-<
/____/_/\\_, /_//_/\\__//_/ /___/
       /___/                                      
`;

export const pkgManagerCommands = {
    npm: { install: 'npm install', dev: 'npm install -D' },
    yarn: { install: 'yarn add', dev: 'yarn add -D' },
    pnpm: { install: 'pnpm add', dev: 'pnpm add -D' }
};
