#!/usr/bin/env node
import { Command } from 'commander';
import { description, name, version } from '../package.json';
import { addCommand } from './commands/add';
import { generateCommand } from './commands/generate';
import { init } from './init/index';

process.on('uncaughtException', (error) => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log('👋 Until next time!');
    } else {
        throw error;
    }
});
const program = new Command();

program.name(name).description(description).version(version, '-v, --version');

// initial command
program.command('init').description('initialize a new API project').action(init);

// generate command
program
    .command('generate')
    .alias('g')
    .description('generate a component')
    .argument('<type>', 'type of component: c/controller, s/service, v/validate, r/resource')
    .argument('<name>', 'name of the component')
    .action((type, name) => generateCommand({ type, name }));

// add command
program
    .command('add')
    .alias('a')
    .description('add a feature')
    .argument('<feature>', 'type of feature: jwt, validation, database etc')
    .action((feature) => addCommand({ feature }));

program.parse();
