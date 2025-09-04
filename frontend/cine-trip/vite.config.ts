import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/ //env불러오기 설정 추가
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    build: {
      outDir: "./dist", //build 파일 저장 위치
      emptyOutDir: true, // 전에 있던 빌드 파일 지우고 다시 생성 설정
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      open: true,
    },
  };
});
