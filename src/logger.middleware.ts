import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    // tslint:disable-next-line:no-console
    console.log('Request=', req.ip);
    next();
  }
}
