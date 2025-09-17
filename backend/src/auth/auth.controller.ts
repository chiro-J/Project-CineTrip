import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. Google OAuth 흐름을 시작하는 엔드포인트
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // 이 함수는 Google 로그인 페이지로 리디렉션
    // 실제 로직은 NestJS의 AuthGuard가 처리, 함수 본문은 비워둠
  }

  // 2. Google OAuth 콜백을 처리하는 엔드포인트
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { access_token, user } = this.authService.login(req.user as any);

    // JWT를 쿠키에 담아 전달
    res.cookie('access_token', access_token, {
      httpOnly: true, // JavaScript에서 접근 불가
      secure: true,   // HTTPS에서만 전송
      sameSite: 'lax', // CSRF 공격 방지
    });

    // 2. 사용자 정보를 JSON 문자열로 변환하여 쿠키에 담아 전달
    res.cookie('user_data', JSON.stringify(user), {
      httpOnly: false, // JavaScript에서 접근 가능하도록 설정
      secure: true,
      sameSite: 'lax',
    });

    // 프런트엔드로 리디렉션
    res.redirect('http://localhost:5173/auth/callback');
  }
}