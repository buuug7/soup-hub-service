import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './logger.middleware';
import { Request, Response } from 'express';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware, myLog).forRoutes('cats');
  }
}

function myLog(req: Request, res: Response, next: () => {}) {
  // tslint:disable-next-line:no-console
  console.log('This is my log middleware');
  next();
}
