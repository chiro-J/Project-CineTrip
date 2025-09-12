// 내 프로필 수정 페이지
import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import Header from "../../components/layout/Header";
import SideNavigationBar from "../../components/layout/SideNavigationBar";

// 사용자 데이터 타입 정의
type UserData = {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
  fallback: string;
  connectedAccounts: Array<{
    id: number;
    provider: string;
    username: string;
    icon: React.ReactElement;
  }>;
};

// 샘플 사용자 데이터
const sampleUserData: UserData = {
  id: 1,
  name: "chiroro",
  email: "wkdcjfgh0222@gmail.com",
  profileImage: null,
  fallback: "C",
  connectedAccounts: [
    {
      id: 1,
      provider: "Google",
      username: "chiroro",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
    },
  ],
};

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempName, setTempName] = useState(user?.username || "");
  const [tempEmail, setTempEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatarUrl || null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 현재 사용자 정보로 초기값 설정
  useEffect(() => {
    if (user) {
      setTempName(user.username);
      setTempEmail(user.email);
      setProfileImage(user.avatarUrl);
    }
  }, [user]);

  // 파일 input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 허용되는 이미지 확장자 및 MIME 타입
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // 이미지 리사이징 함수
  const resizeImage = (file: File, maxSize: number = 200): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // 정사각형으로 크롭하기 위한 계산
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        canvas.width = maxSize;
        canvas.height = maxSize;

        // 이미지를 정사각형으로 크롭하여 그리기
        ctx?.drawImage(
          img,
          offsetX,
          offsetY,
          size,
          size,
          0,
          0,
          maxSize,
          maxSize
        );

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // 파일 유효성 검증 함수
  const validateImageFile = (
    file: File
  ): { isValid: boolean; errorMessage?: string } => {
    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        errorMessage: "파일 크기는 10MB 이하여야 합니다.",
      };
    }

    // MIME 타입 검사
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        errorMessage: `지원되는 이미지 형식은 ${ALLOWED_EXTENSIONS.join(", ")} 입니다.`,
      };
    }

    // 파일 확장자 검사 (이중 검증)
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext.toLowerCase())
    );

    if (!hasValidExtension) {
      return {
        isValid: false,
        errorMessage: `지원되는 이미지 형식은 ${ALLOWED_EXTENSIONS.join(", ")} 입니다.`,
      };
    }

    return { isValid: true };
  };

  // 파일 선택 핸들러
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검증
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.errorMessage);
      event.target.value = "";
      return;
    }

    setIsProcessingImage(true);

    try {
      const resizedImageUrl = await resizeImage(file);
      setProfileImage(resizedImageUrl);
      console.log("프로필 사진 변경 완료");
    } catch (error) {
      console.error("이미지 처리 중 오류:", error);
      alert("이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessingImage(false);
    }

    // input 값 초기화 (같은 파일 재선택 가능하도록)
    event.target.value = "";
  };

  // 프로필 사진 변경 버튼 클릭
  const handlePhotoChange = () => {
    fileInputRef.current?.click();
  };

  // 프로필 사진 제거 (기본 아바타로 되돌리기)
  const handlePhotoRemove = () => {
    setProfileImage(null);
    console.log("프로필 사진을 기본 아바타로 변경");
  };

  // 이름 편집 핸들러
  const handleNameEdit = () => {
    if (isEditingName) {
      setIsEditingName(false);
      console.log("이름 편집 완료:", tempName);
    } else {
      setIsEditingName(true);
    }
  };

  // 이메일 편집 핸들러
  const handleEmailEdit = () => {
    if (isEditingEmail) {
      setIsEditingEmail(false);
      console.log("이메일 편집 완료:", tempEmail);
    } else {
      setIsEditingEmail(true);
    }
  };

  // 편집 취소 핸들러
  const handleCancelEdit = (type: "name" | "email") => {
    if (type === "name") {
      setTempName(user?.username || "");
      setIsEditingName(false);
    } else if (type === "email") {
      setTempEmail(user?.email || "");
      setIsEditingEmail(false);
    }
  };

  // 전체 저장 핸들러
  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      // AuthContext의 user 정보 업데이트
      if (user) {
        const updatedUser = {
          ...user,
          username: tempName,
          email: tempEmail,
          avatarUrl: profileImage || user.avatarUrl,
        };
        login(updatedUser);
      }

      // 저장 시뮬레이션 (실제로는 API 호출)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("프로필 저장 완료:", { name: tempName, email: tempEmail, avatar: profileImage });

      // /profile 페이지로 이동
      navigate("/profile");
    } catch (error) {
      console.error("저장 중 오류:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header />
      <SideNavigationBar />
      <div className="p-8 mt-12 bg-gray-50">
        <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">프로필</h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/profile")}
                disabled={isSaving}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSaveAll}
                loading={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            {/* 프로필 사진 섹션 */}
            <div className="p-8 border-b border-gray-100">
              <h2
                className="mb-6 text-lg font-semibold text-gray-900"
                style={{ textAlign: "left" }}
              >
                프로필 사진
              </h2>
              {/* 숨겨진 파일 input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <table style={{ width: "100%", tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "30%",
                        verticalAlign: "middle",
                        textAlign: "left",
                      }}
                    >
                      <Avatar
                        src={profileImage || undefined}
                        size="xl"
                        fallback={user?.username?.charAt(0).toUpperCase()}
                        className="bg-blue-500"
                      />
                    </td>
                    <td
                      style={{
                        width: "40%",
                        verticalAlign: "middle",
                        textAlign: "left",
                        paddingLeft: "20px",
                      }}
                    >
                      {/* 이미지 처리 안내 문구 */}
                      <div className="text-sm text-gray-600">
                        <p>• 지원 형식: JPG, PNG, WebP, GIF (최대 10MB)</p>
                        <p>• 이미지는 자동으로 200×200 픽셀로 조정됩니다</p>
                        <p>• 정사각형으로 자동 크롭되어 최적화됩니다</p>
                      </div>
                    </td>
                    <td
                      style={{
                        width: "30%",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="outline"
                          size="md"
                          onClick={handlePhotoRemove}
                        >
                          사진 제거
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={handlePhotoChange}
                          disabled={isProcessingImage}
                        >
                          {isProcessingImage ? "처리 중..." : "사진 변경"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 이름 섹션 */}
            <div className="p-8 border-b border-gray-100">
              <h2
                className="mb-6 text-lg font-semibold text-gray-900"
                style={{ textAlign: "left" }}
              >
                이름
              </h2>
              <table style={{ width: "100%", tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "70%",
                        verticalAlign: "middle",
                        textAlign: "left",
                      }}
                    >
                      {isEditingName ? (
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="w-full max-w-md px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="이름을 입력하세요"
                          style={{ maxWidth: "400px" }}
                        />
                      ) : (
                        <span className="text-lg text-gray-700">
                          {tempName}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        width: "30%",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {isEditingName ? (
                          <>
                            <Button size="md" onClick={handleNameEdit}>
                              저장
                            </Button>
                            <Button
                              variant="outline"
                              size="md"
                              onClick={() => handleCancelEdit("name")}
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="md"
                            onClick={handleNameEdit}
                          >
                            편집
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 이메일 섹션 */}
            <div className="p-8 border-b border-gray-100">
              <h2
                className="mb-6 text-lg font-semibold text-gray-900"
                style={{ textAlign: "left" }}
              >
                이메일 주소
              </h2>
              <table style={{ width: "100%", tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "70%",
                        verticalAlign: "middle",
                        textAlign: "left",
                      }}
                    >
                      {isEditingEmail ? (
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="w-full max-w-md px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="이메일을 입력하세요"
                          style={{ maxWidth: "400px" }}
                        />
                      ) : (
                        <span className="text-lg text-gray-700">
                          {tempEmail}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        width: "30%",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {isEditingEmail ? (
                          <>
                            <Button size="md" onClick={handleEmailEdit}>
                              저장
                            </Button>
                            <Button
                              variant="outline"
                              size="md"
                              onClick={() => handleCancelEdit("email")}
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="md"
                            onClick={handleEmailEdit}
                          >
                            편집
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 연결된 소셜 계정 섹션 */}
            <div className="p-8">
              <h2
                className="mb-6 text-lg font-semibold text-gray-900"
                style={{ textAlign: "left" }}
              >
                연결된 소셜 계정
              </h2>
              {sampleUserData.connectedAccounts.length > 0 ? (
                <div className="space-y-4">
                  {sampleUserData.connectedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="p-6 border border-gray-200 rounded-lg"
                    >
                      <table style={{ width: "100%", tableLayout: "fixed" }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                width: "70%",
                                verticalAlign: "middle",
                                textAlign: "left",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "16px",
                                }}
                              >
                                <div className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-gray-50">
                                  {account.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {account.provider}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {account.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                width: "30%",
                                verticalAlign: "middle",
                                textAlign: "right",
                              }}
                            >
                              <Button
                                variant="outline"
                                size="md"
                                onClick={() => console.log("연결 해제:", account.id)}
                              >
                                연결 해제
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
                  연결된 소셜 계정이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditPage;
