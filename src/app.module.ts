import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './logger.middleware';
import { Request, Response } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CatsModule, TypeOrmModule.forRoot(), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
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
