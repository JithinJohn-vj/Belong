import { DataSource } from 'typeorm';
import { config } from '../config';

// TODO: Import your entities here

const dataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [
    // TODO: Add your entity classes here
  ],
  migrations: [
    // TODO: Add migration paths
  ],
  synchronize: false, // Use migrations instead
  logging: false,
});

export { dataSource };

// TODO: Create a Fastify plugin that initializes the DataSource
// and decorates the Fastify instance with it
