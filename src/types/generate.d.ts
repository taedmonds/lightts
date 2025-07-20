type GenerateCommandType = 'controller' | 'c' | 'service' | 's' | 'schema' | 'v' | 'resource' | 'r';

interface GenerateCommandArguments {
    name: string;
    type: GenerateCommandType;
}

interface GenerateCommandProps extends GenerateCommandArguments {
    lightts: LiteTsConfig;
}
