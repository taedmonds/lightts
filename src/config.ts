// constants
export const ROOT_DIR = 'src';
export const LITETS_DIR = '.lightts';

export const CORE_DIR = `${ROOT_DIR}/core`;
export const MODULES_DIR = `${ROOT_DIR}/modules`;
export const MIDDLEWARE_DIR = `${ROOT_DIR}/middleware`;
export const DATABASE_DIR = `${ROOT_DIR}/database`;
export const TYPES_DIR = `${ROOT_DIR}/types`;

export const DEFAULT_LITETS_CONFIG: LiteTsConfig = {
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
    __    _ __     ______
   / /   (_) /____/_  __/____
  / /   / / __/ _ \/ / / ___/
 / /___/ / /_/  __/ / (__  )
/_____/_/\__/\___/_/ /____/
`;

export const pkgManagerCommands = {
    npm: { install: 'npm install', dev: 'npm install -D' },
    yarn: { install: 'yarn add', dev: 'yarn add -D' },
    pnpm: { install: 'pnpm add', dev: 'pnpm add -D' }
};
