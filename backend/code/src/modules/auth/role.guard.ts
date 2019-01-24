import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesFromClass = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    const rolesFromMethod = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const roles = [].concat(rolesFromClass || [], rolesFromMethod || []);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // const hasRole = () => user.roles.some(role => roles.includes(role));
    // return user && user.roles && hasRole();
    const hasRole = () => roles.includes(user.role);
    return user && user.role && hasRole();
  }
}
