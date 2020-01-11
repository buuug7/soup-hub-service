import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getClass());
    // tslint:disable-next-line:no-console
    console.log('roles====', roles);
    if (!roles) {
      return true;
    }
    const myRoles = ['admin'];

    const haveRole = () => myRoles.some(role => roles.includes(role));

    // tslint:disable-next-line:no-console
    console.log('haveRole====', haveRole());

    return haveRole();
  }
}
