import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';
const FRONT_BASE = process.env.FRONT_BASE ?? (isProd ? 'https://cinetrip.link' : 'http://localhost:5173');
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? (isProd ? '.cinetrip.link' : undefined);

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

    // 공통 쿠키 옵션
    const baseCookie =
      isProd
        ? ({
            path: '/',
            secure: true,            // ✅ HTTPS 필수
            sameSite: 'none' as const, // ✅ cross-site 허용
            domain: COOKIE_DOMAIN,   // ✅ .cinetrip.link
          })
        : ({
            path: '/',
            secure: false,
            sameSite: 'lax' as const,
          });

    // JWT를 쿠키에 담아 전달
    res.cookie('access_token', access_token, {
      httpOnly: true, // JavaScript에서 접근 불가
      ...baseCookie,
      // 선택: 만료 지정
      // maxAge: 1000 * 60 * 60 * 24 * 7,
      // secure: false,   // HTTPS에서만 전송
      // sameSite: 'none', // CSRF 공격 방지
    });

    // 2. 사용자 정보를 JSON 문자열로 변환하여 쿠키에 담아 전달
    res.cookie('user_data', JSON.stringify(user), {
      httpOnly: false, // JavaScript에서 접근 가능하도록 설정
      ...baseCookie,
      // secure: false,
      // sameSite: 'none',
    });

    // 프런트엔드로 리디렉션
    res.redirect('${FRONT_BASE}/auth/callback');
  }

  // 3. 사용자 정보 조회 엔드포인트 추가
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드로 보호
  getProfile(@Req() req: Request) {
    // 요청에 담긴 사용자 정보 반환
    return req.user;
  }
}