import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(googleUser: any) {
    // Google에서 받은 데이터를 프런트엔드에 맞는 구조로 표준화
    const frontendUser = {
      email: googleUser.email,
      username: googleUser.firstName,
    };
    const payload = { ...frontendUser, sub: frontendUser.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: frontendUser, // 표준화된 유저 객체를 함께 반환
    };
  }
}