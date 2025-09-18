import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';
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

    try {
    	// api 서브도메인으로 심겨 있던 잔존 쿠키 제거
    	res.clearCookie('access_token', { path: '/', domain: 'api.cinetrip.link', secure: true, sameSite: 'none', httpOnly: true });
    	res.clearCookie('user_data',    { path: '/', domain: 'api.cinetrip.link', secure: true, sameSite: 'none', httpOnly: false });
    	// 옵션 누락/경로 상이로 남아있는 쿠키 광범위 정리
    	res.clearCookie('access_token');
    	res.clearCookie('user_data');
	} catch {}

    // 공통 쿠키 옵션
    const baseCookie =({
            path: '/',
            secure: true,            // ✅ HTTPS 필수
            sameSite: 'none' as const, // ✅ cross-site 허용
            domain: '.cinetrip.link',   // ✅ .cinetrip.link
          });

    // JWT를 쿠키에 담아 전달
    res.cookie('access_token', access_token, {
      httpOnly: true, // JavaScript에서 접근 불가
      ...baseCookie,
      // 선택: 만료 지정
      maxAge: 1000 * 60 * 60 * 24 * 7,
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
    res.redirect('https://cinetrip.link/auth/callback');
  }

  // 3. 사용자 정보 조회 엔드포인트 추가
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드로 보호
  getProfile(@Req() req: Request) {
    // 요청에 담긴 사용자 정보 반환
    return req.user;
  }

  // 4. 로그아웃 엔드포인트 추가 (쿠키 삭제)
  @Post('logout')
  async logout(@Res() res: Response) {
    const baseCookie = {
      path: '/',
      secure: true,
      sameSite: 'none' as const,
      domain: '.cinetrip.link',
    };

    res.clearCookie('access_token', { httpOnly: true,  ...baseCookie });
    res.clearCookie('user_data',    { httpOnly: false, ...baseCookie });
    return res.status(204).send(); // No Content
  }
}
