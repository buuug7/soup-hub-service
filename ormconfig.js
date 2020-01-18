module.exports =   {
  name: 'default',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'soup_hub',
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'dist/**/*.entity{.ts,.js}',
    migrationsDir: 'src/migration/**/*.ts',
    subscribersDir: 'src/subscriber/**/*.ts',
  },
  seeds: ['dist/seeds/**/*.seed.ts'],
  factories: ['src/factories/**/*.factory.ts'],
};