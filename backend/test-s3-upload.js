const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// .env 파일 로드
require('dotenv').config({ path: './.env' });

async function testS3Upload() {
  console.log('=== AWS S3 업로드 테스트 시작 ===');

  // 환경변수 확인
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const awsBucketName = process.env.AWS_S3_BUCKET_NAME;
  const awsRegion = process.env.AWS_REGION || 'ap-northeast-2';

  console.log(`AWS_ACCESS_KEY_ID: ${awsAccessKeyId ? '설정됨' : '미설정'}`);
  console.log(`AWS_SECRET_ACCESS_KEY: ${awsSecretAccessKey ? '설정됨' : '미설정'}`);
  console.log(`AWS_S3_BUCKET_NAME: ${awsBucketName}`);
  console.log(`AWS_REGION: ${awsRegion}`);

  if (!awsAccessKeyId || !awsSecretAccessKey || !awsBucketName) {
    console.error('❌ AWS 설정이 완전하지 않습니다.');
    return;
  }

  // S3 클라이언트 생성
  const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  // 테스트용 이미지 데이터 생성 (간단한 SVG)
  const testImageData = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="blue"/>
    <text x="50" y="55" text-anchor="middle" fill="white" font-size="12">Test</text>
  </svg>`;

  const fileName = `test-${Date.now()}.svg`;
  const key = `uploads/${fileName}`;

  console.log(`\n📤 업로드 시도: ${key}`);

  const command = new PutObjectCommand({
    Bucket: awsBucketName,
    Key: key,
    Body: Buffer.from(testImageData),
    ContentType: 'image/svg+xml',
    // ACL 제거 - 버킷 정책으로 public access 설정 필요
  });

  try {
    await s3Client.send(command);
    const imageUrl = `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
    console.log('✅ 업로드 성공!');
    console.log(`🔗 이미지 URL: ${imageUrl}`);
    console.log('\n브라우저에서 위 URL을 열어 이미지를 확인하세요.');
  } catch (error) {
    console.error('❌ 업로드 실패:', error.message);
    console.error('에러 상세:', error);
  }
}

testS3Upload().catch(console.error);