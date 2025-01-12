import { DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'db_projeto',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
