type FileStyle = 'regular' | 'angular';

type Features = 'jwt' | 'validation' | 'database' | 'cors';

type DBTypes = 'none' | 'postgres' | 'mysql' | 'mariadb' | 'mongodb';

type LintConfigs = 'eslint' | 'prettier' | 'husky';

type PKGTypes = 'npm' | 'pnpm' | 'yarn';

interface DBConfigs {
    dbType: DBTypes;
    seeders: boolean;
    dummyData: boolean;
    migrations: boolean;
}

interface PromptConfig {
    name: string;
    fileStyle: FileStyle;
    features: Features[];
    dbConfigs: DBConfigs;
    lintConfigs: LintConfigs[];
    pkg: PKGTypes;
}
