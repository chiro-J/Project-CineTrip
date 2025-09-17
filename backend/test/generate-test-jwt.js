const jwt = require('jsonwebtoken');

// 테스트용 사용자 정보
const testUser = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  username: 'testuser'
};

// JWT 시크릿 (기본값 사용, .env에서 설정된 값과 동일해야 함)
const JWT_SECRET = 'your-jwt-secret-key';

// JWT 토큰 생성
const token = jwt.sign(testUser, JWT_SECRET, {
  expiresIn: '7d'
});

console.log('=== 테스트용 JWT 토큰 ===');
console.log(token);
console.log('\n=== 포스트맨에서 사용법 ===');
console.log('Authorization 헤더에 다음과 같이 입력:');
console.log(`Bearer ${token}`);
console.log('\n=== 토큰 정보 ===');
console.log('User ID:', testUser.id);
console.log('Email:', testUser.email);
console.log('Username:', testUser.username);
console.log('만료일: 7일');