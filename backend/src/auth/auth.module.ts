import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy'; // 새로 추가할 전략을 임포트

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'devjwtsecret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '60m' },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy], // 새로 추가할 전략을 프로바이더에 추가
  exports: [AuthService], // 필요한 경우 AuthService를 외부에서 사용할 수 있도록 export
})
export class AuthModule {}
