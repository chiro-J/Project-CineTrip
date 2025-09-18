import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'https://api.cinetrip.link/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  authorizationParams(): any {
    return {
      prompt: 'select_account', // or 'consent' | 'consent select_account'
      // access_type: 'offline', // 리프레시 토큰 필요하면
    };
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    // Passport는 이 user 객체를 req.user에 첨부합니다.
    done(null, user);
  }
}