import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class LoginInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // tslint:disable-next-line:no-console
    console.log('Before ...');

    const now: any = new Date();

    return next
      .handle()
      .pipe(tap(() => console.log(`After...${Date.now() - now}ms`)))
      .pipe(catchError(err => throwError('fuck')));
  }
}
