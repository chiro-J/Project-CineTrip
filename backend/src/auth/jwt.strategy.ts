import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

function extractJwtFromCookie(req: any): string | null {
  if (req && req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,                     // ✅ 쿠키에서 읽기
        ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ 헤더에서도 허용
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // AuthGuard('jwt')가 실행되면 req.user에 이 값이 들어감
    return { userId: payload.sub, email: payload.email };
  }
}
