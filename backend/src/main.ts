import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 쿠키 파서 미들웨어 추가
  app.use(cookieParser());

  // CORS 설정
  app.enableCors({
    origin: ['http://cinetrip.link', 'https://cinetrip.link'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000); // 백엔드 포트 번호
}
bootstrap();