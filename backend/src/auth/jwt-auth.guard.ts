import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    console.log('Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JwtAuthGuard handleRequest:', { err, user, info });
    if (err || !user) {
      console.log('Authentication failed:', { err, info });
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}