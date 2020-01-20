# soup hub service

An application where collect and share awesome soups. this repository is the service/backend of the soup hub. use node [nest](https://github.com/nestjs/nest) as framework

## usage

- `git clone https://github.com/buuug7/soup-hub-service-nest.git`
- `cd soup-hub-service-nest`
- `npm install`
- `npm run start:dev`

sync database with typeOrm schema: `npm run db-sync`

## production

- run `npm run build`
- `docker build --tag buuug7/soup-hub:1.0.0`
- `docker-composer up`
