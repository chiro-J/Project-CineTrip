import React, { useState, useEffect } from "react";
import { X, Camera, MapPin, Upload } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth, type UserPhoto } from "../../contexts/AuthContext";

interface PostUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostUploadModal: React.FC<PostUploadModalProps> = ({ isOpen, onClose }) => {
  const { addPhoto, user } = useAuth();

  // 이미지 압축 함수
  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 비율 유지하면서 최대 너비 제한
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 압축된 이미지를 base64로 변환
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };
  // 모든 상태 변수들을 명확히 정의
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<
    "landscape" | "portrait" | "square"
  >("landscape");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // 모달 스크롤 락
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  const steps = [
    { step: 1, label: "유형 선택" },
    { step: 2, label: "이미지 업로드" },
    { step: 3, label: "정보 입력" },
  ];

  const postTypes = [
    {
      id: "shooting",
      title: "촬영지 사진",
      icon: Camera,
      description: "멋진 촬영 장소를 공유해보세요",
    },
    {
      id: "nearby",
      title: "인근 장소 추천",
      icon: MapPin,
      description: "주변 추천 장소를 알려주세요",
    },
  ];

  const handleTypeSelect = (typeId: string) => {
    console.log("Selected type:", typeId);
    setSelectedType(typeId);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError("");

    if (!file) return;

    // 파일 확장자 검증
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (
      !allowedTypes.includes(file.type) ||
      !allowedExtensions.includes(fileExtension)
    ) {
      setUploadError("JPG, PNG, WEBP, GIF 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지 압축 후 업로드
    compressImage(file).then((compressedDataUrl) => {
      const img = new Image();
      img.onload = () => {
        // 이미지 비율 계산
        const ratio = img.width / img.height;
        if (ratio > 1.5) {
          setImageAspectRatio("landscape");
        } else if (ratio < 0.75) {
          setImageAspectRatio("portrait");
        } else {
          setImageAspectRatio("square");
        }
      };
      img.src = compressedDataUrl;
      setUploadedImage(compressedDataUrl);
      console.log(`원본 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB, 압축 후: ${(compressedDataUrl.length * 0.75 / 1024 / 1024).toFixed(2)}MB`);
    });
  };

  const handleContinue = () => {
    console.log(
      "Continue clicked, current step:",
      currentStep,
      "selected type:",
      selectedType
    );

    if (currentStep === 1 && selectedType) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(2);
        setIsTransitioning(false);
      }, 150);
    } else if (currentStep === 2 && uploadedImage) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(3);
        setIsTransitioning(false);
      }, 150);
    } else if (currentStep === 3 && location && uploadedImage) {
      setIsUploading(true);

      // 새로운 사진 데이터 생성
      const newPhoto: UserPhoto = {
        id: `photo-${Date.now()}`, // 임시 ID 생성
        src: uploadedImage,
        alt: description || `${selectedType === "shooting" ? "촬영지" : "인근 장소"} 사진`,
        title: location,
        location: tags || location,
        description: description, // 설명 추가
        likes: 0,
        likedBy: [], // 좋아요 누른 사용자 목록 초기화
        authorId: user?.id, // 현재 로그인한 사용자 ID
        authorName: user?.username, // 현재 로그인한 사용자 이름
        uploadDate: new Date().toISOString().split('T')[0],
      };

      // 실제 업로드 로직을 시뮬레이션 (2초 후 완료)
      setTimeout(() => {
        // AuthContext의 addPhoto 함수를 사용하여 사진 추가
        addPhoto(newPhoto);
        console.log("게시물 업로드 완료!", newPhoto);
        setIsUploading(false);
        closeModal();
      }, 2000);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // 현재 단계보다 이전 단계로만 이동 가능
    if (stepNumber < currentStep) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(stepNumber);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const closeModal = () => {
    // 상태 초기화
    setCurrentStep(1);
    setSelectedType(null);
    setUploadedImage(null);
    setUploadError("");
    setIsTransitioning(false);
    setImageAspectRatio("landscape");
    setIsUploading(false);
    setDescription("");
    setTags("");
    setLocation("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div
        className={`bg-white rounded-2xl p-5 w-full mx-auto relative transition-all duration-300 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto ${
          currentStep === 3 ? "max-w-5xl" : "max-w-4xl"
        }`}
      >
        {/* Close Button */}
        <Button
          onClick={closeModal}
          variant="ghost"
          size="sm"
          className="absolute text-gray-400 top-4 right-4 hover:text-gray-600"
        >
          <X size={24} />
        </Button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mt-8 mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all cursor-pointer ${
                    step.step <= currentStep
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-400 text-white"
                  } ${
                    step.step < currentStep
                      ? "hover:bg-emerald-600 hover:scale-105"
                      : step.step === currentStep
                        ? ""
                        : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => handleStepClick(step.step)}
                >
                  {step.step}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-colors ${
                    step.step < currentStep ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Content with Slide Animation */}
        <div className="mt-12">
          <div
            className={`transition-transform duration-300 ease-in-out ${
              isTransitioning
                ? "transform translate-x-2 opacity-50"
                : "transform translate-x-0 opacity-100"
            }`}
          >
            {/* STEP 1: 유형 선택 */}
            {currentStep === 1 && (
              <div>
                <div className="flex justify-center gap-12 mt-4 mb-12">
                  {postTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        className={`flex-1 max-w-xs cursor-pointer transition-all duration-200 ${
                          selectedType === type.id
                            ? "transform scale-105"
                            : "hover:transform hover:scale-102"
                        }`}
                      >
                        <div
                          className={`bg-gray-100 rounded-2xl p-5 h-48 flex flex-col items-center justify-center text-center border-2 transition-all ${
                            selectedType === type.id
                              ? "border-emerald-500 bg-emerald-50 shadow-lg"
                              : "border-transparent hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                              selectedType === type.id
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            <Icon size={24} />
                          </div>
                          <h3
                            className={`text-lg font-bold mb-2 transition-colors ${
                              selectedType === type.id
                                ? "text-emerald-700"
                                : "text-gray-800"
                            }`}
                          >
                            {type.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {type.description}
                          </p>

                          {selectedType === type.id && (
                            <div className="flex items-center justify-center w-5 h-5 mt-2 rounded-full bg-emerald-500">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                              >
                                <polyline points="20,6 9,17 4,12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mb-4 text-sm text-center text-gray-400">
                  게시물 유형을 선택하고 계속 진행하세요
                </p>
              </div>
            )}

            {/* STEP 2: 이미지 업로드 */}
            {currentStep === 2 && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="w-full max-w-md space-y-4">
                    <h3 className="mt-2 mb-8 text-xl font-semibold text-center text-gray-800">
                      {selectedType === "shooting"
                        ? "촬영지 사진"
                        : "인근 장소 추천"}
                    </h3>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        accept=".jpg,.jpeg,.png,.webp,.gif"
                        onChange={handleImageUpload}
                        className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`w-full h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                          uploadedImage
                            ? "border-emerald-400 bg-emerald-50"
                            : uploadError
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {uploadedImage ? (
                          <div className="relative w-full h-full">
                            <img
                              src={uploadedImage}
                              alt={
                                selectedType === "shooting"
                                  ? "촬영지 사진"
                                  : "인근 장소 추천"
                              }
                              className={`w-full h-full rounded-xl ${
                                imageAspectRatio === "portrait" ||
                                imageAspectRatio === "landscape"
                                  ? "object-contain bg-gray-50"
                                  : "object-cover"
                              }`}
                            />
                            <div className="absolute p-2 text-white rounded-full top-3 right-3 bg-emerald-500">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="20,6 9,17 4,12"></polyline>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload
                              className={`w-12 h-12 mb-3 ${uploadError ? "text-red-400" : "text-gray-400"}`}
                            />
                            <p
                              className={`text-lg text-center font-medium mb-2 ${uploadError ? "text-red-600" : "text-gray-600"}`}
                            >
                              {selectedType === "shooting"
                                ? "촬영지 사진 업로드"
                                : "인근 장소 사진 업로드"}
                            </p>
                            <p className="text-sm text-center text-gray-500">
                              JPG, PNG, WEBP, GIF (최대 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {uploadError && (
                      <p className="mt-2 text-sm text-center text-red-500">
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mb-6 text-sm text-center text-gray-400">
                  이미지를 업로드하면 다음 단계로 진행할 수 있습니다
                </p>
              </div>
            )}

            {/* STEP 3: 정보 입력 - 40:60 비율로 조정 */}
            {currentStep === 3 && (
              <div>
                <div className="grid grid-cols-5 gap-6 mb-6">
                  {/* 왼쪽: 업로드된 이미지 (40%) */}
                  <div className="col-span-2 space-y-3">
                    <h3 className="mb-8 text-lg font-semibold text-gray-800">
                      업로드된 이미지
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        {selectedType === "shooting"
                          ? "촬영지 사진"
                          : "인근 장소 추천"}
                      </p>
                      {uploadedImage && (
                        <div
                          className={`w-full rounded-lg overflow-hidden ${
                            imageAspectRatio === "portrait"
                              ? "h-80"
                              : imageAspectRatio === "landscape"
                                ? "h-56"
                                : "h-64"
                          }`}
                        >
                          <img
                            src={uploadedImage}
                            alt={
                              selectedType === "shooting"
                                ? "촬영지 사진"
                                : "인근 장소 추천"
                            }
                            className={`w-full h-full ${
                              imageAspectRatio === "portrait" ||
                              imageAspectRatio === "landscape"
                                ? "object-contain bg-gray-50"
                                : "object-cover"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 오른쪽: 입력 폼 (60%) */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="mb-8 text-lg font-semibold text-gray-800">
                      게시물 정보
                    </h3>

                    {/* 위치 정보 */}
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                          위치명 *
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="촬영 위치를 입력하세요"
                          className="w-full px-4 py-3 mb-2 transition-colors border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          disabled={isUploading}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                          주소 (선택사항)
                        </label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="상세 주소를 입력하세요"
                          className="w-full px-4 py-3 mb-2 transition-colors border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          disabled={isUploading}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                          댓글
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="이 장소에 대한 설명이나 팁을 공유해주세요..."
                          rows={4}
                          className="w-full px-4 py-3 mb-2 transition-colors border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          {currentStep > 1 ? (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="lg"
              disabled={isUploading}
            >
              이전
            </Button>
          ) : (
            <div></div>
          )}

          <Button
            onClick={handleContinue}
            loading={isUploading}
            disabled={
              (currentStep === 1 && !selectedType) ||
              (currentStep === 2 && !uploadedImage) ||
              (currentStep === 3 && !location) ||
              isUploading
            }
            variant="primary"
            size="lg"
            className="px-8"
          >
            {currentStep === 3 ? "업로드" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostUploadModal;
