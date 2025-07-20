interface PackageJSON {
    name: string;
    version: string;
    description: string;
    main: string;
    scripts: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    license: string;
    husky?: {
        hooks: {
            'pre-commit': string;
        };
    };
    'lint-staged'?: Record<string, string[]>;
}

interface LiteTsConfig {
    name: string;
    fileStyle: FileStyle;
    package: PKGTypes;
    features: Features[];
    dbConfigs: DBConfigs;
}
