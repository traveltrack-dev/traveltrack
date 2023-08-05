const { Client, Pool } = require('pg');
const fs = require('fs');


exports.connect = async (config) => {
    const client = new Client({
        host: config.db_host,
        port: config.db_port,
        database: config.db_name,
        user: config.db_name,
        password: config.db_password,
    });
    await client.connect();
    const queryResult = await client.query('SELECT 1 AS one;');
    const pool = new Pool({
        host: config.db_host,
        port: config.db_port,
        database: config.db_name,
        user: config.db_name,
        password: config.db_password,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    await pool.connect();
    const poolQueryResult = await pool.query('SELECT 1 AS one;');
    if (queryResult.rows[0].one !== 1 || poolQueryResult.rows[0].one !== 1) {
        throw new Error('failed to connect to database');
    } else {
        return {
            client: client,
            pool: pool
        };
    }
};

exports.migrate = async (client) => {
    const migrationTableExistsQuery = `
        SELECT exists (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'migrations'
        );
    `;
    const migrationTableExistsResult = await client.query(migrationTableExistsQuery);
    if (!migrationTableExistsResult.rows[0].exists) {
        const createMigrationTableQuery = `
            CREATE TABLE migrations (
                id serial PRIMARY KEY,
                name text NOT NULL,
                created_at timestamp NOT NULL DEFAULT NOW()
            );
        `;
        await client.query(createMigrationTableQuery);
    };

    const lastMigrationQuery = `
        SELECT name FROM migrations ORDER BY id DESC LIMIT 1;
    `;
    const lastMigrationResult = await client.query(lastMigrationQuery);
    const lastMigration = lastMigrationResult.rows[0] ? lastMigrationResult.rows[0].name : '';
    const migrations = fs.readdirSync('./database') 
        .filter(file => file.endsWith('.sql'))
        .sort();
    const newMigrations = migrations.filter(migration => migration > lastMigration);
    if (newMigrations.length < 1) {
        console.info('no migrations to run');
    } else {
        for (migration of migrations) {
            console.info(`running migration ${migration}...`);
            const migrationQuery = fs.readFileSync(`./database/${migration}`, 'utf8');
            await client.query(migrationQuery);
            const insertMigrationQuery = `
                INSERT INTO migrations (name) VALUES ('${migration}');
            `;
            await client.query(insertMigrationQuery);
            console.info(`migration ${migration} complete`);
        }
    }
    return true;
};