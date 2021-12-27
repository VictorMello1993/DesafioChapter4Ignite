import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'finance_db'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database: process.env.NODE_ENV === 'test' ? 'finance_db_test' : defaultOptions.database,
    }),
  );
};
