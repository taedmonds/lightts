import { confirm, select } from '@inquirer/prompts';

export async function askDbType(): Promise<DBTypes> {
    return await select({
        message:
            'Which database is your flavor? (TypeORM supports tons, but here are the fan favorites)',
        choices: [
            { name: 'PostgreSQL', value: 'postgres' },
            { name: 'MySQL', value: 'mysql' },
            { name: 'MariaDB', value: 'mariadb' },
            { name: 'MongoDB', value: 'mongodb' }
        ],
        default: 'postgres'
    });
}

export async function askSeeders() {
    return await confirm({
        message: 'Want some seeders to add starter data?',
        default: true
    });
}

export async function askDummyData() {
    return await confirm({
        message: 'Need dummy data to fill your database with test content?',
        default: true
    });
}

export async function askMigrations() {
    return await confirm({
        message: 'Need migrations to keep your database schema in sync?',
        default: true
    });
}
