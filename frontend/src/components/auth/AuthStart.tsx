import { useEffect, useRef } from "react";

const BACKEND_GOOGLE_URL = "http://localhost:3000/auth/google";

export default function AuthStart() {
  const did = useRef(false);

  useEffect(() => {
    if (did.current) return; // StrictMode 가드
    did.current = true;
    // 현재 탭으로 바로 이동 (팝업 차단 안 걸림)
    window.location.replace(BACKEND_GOOGLE_URL); 
  }, []);

  return <div className="p-6 text-center">구글 로그인으로 이동 중…</div>;
}
