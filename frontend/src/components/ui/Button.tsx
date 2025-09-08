// 스타일 미리보기 : https://claude.ai/public/artifacts/a1befe4d-b86d-4a73-a236-d302342a21be

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}) => {
  const getSizeStyles = (size: ButtonSize) => {
    const sizeMap = {
      xs: { padding: "px-2 py-1", fontSize: "12px", gap: "gap-1" },
      sm: { padding: "px-3 py-2", fontSize: "14px", gap: "gap-1.5" },
      md: { padding: "px-4 py-2.5", fontSize: "16px", gap: "gap-2" },
      lg: { padding: "px-6 py-3", fontSize: "18px", gap: "gap-2.5" },
      xl: { padding: "px-8 py-4", fontSize: "20px", gap: "gap-3" },
    };
    return sizeMap[size];
  };

  const sizeConfig = getSizeStyles(size);

  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
  `;

  const variants = {
    primary: `
      bg-gray-800 text-white
      hover:bg-gray-700 active:bg-gray-900
      focus:ring-gray-500
      disabled:hover:bg-gray-800
    `,
    secondary: `
      bg-gray-200 text-gray-900
      hover:bg-gray-300 active:bg-gray-400
      focus:ring-gray-300
      disabled:hover:bg-gray-200
    `,
    outline: `
      border-2 border-gray-800 text-gray-800 bg-transparent
      hover:bg-gray-800 hover:text-white
      active:bg-gray-900 active:text-white
      focus:ring-gray-500
      disabled:hover:bg-transparent disabled:hover:text-gray-800
    `,
    ghost: `
      text-gray-800 bg-transparent
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-300
      disabled:hover:bg-transparent
    `,
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizeConfig.padding}
        ${sizeConfig.gap}
        ${className}
      `}
      style={{ fontSize: sizeConfig.fontSize }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

// 사용 예시
export default function App() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 bg-gray-50">
      <h1 className="mb-8 text-3xl font-bold">Universal Button Component</h1>

      {/* Variants */}
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={handleClick}>Primary</Button>
        <Button variant="secondary" onClick={handleClick}>
          Secondary
        </Button>
        <Button variant="outline" onClick={handleClick}>
          Outline
        </Button>
        <Button variant="ghost" onClick={handleClick}>
          Ghost
        </Button>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap items-center gap-4">
        <Button size="xs" onClick={handleClick}>
          XS
        </Button>
        <Button size="sm" onClick={handleClick}>
          Small
        </Button>
        <Button size="md" onClick={handleClick}>
          Medium
        </Button>
        <Button size="lg" onClick={handleClick}>
          Large
        </Button>
        <Button size="xl" onClick={handleClick}>
          XL
        </Button>
      </div>

      {/* With Icons */}
      <div className="flex flex-wrap items-center gap-4">
        <Button leftIcon={<span>←</span>} onClick={handleClick}>
          Back
        </Button>
        <Button rightIcon={<span>→</span>} onClick={handleClick}>
          Continue
        </Button>
      </div>

      {/* States */}
      <div className="flex flex-wrap items-center gap-4">
        <Button loading onClick={handleClick}>
          Loading
        </Button>
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      </div>

      {/* Full Width */}
      <div className="w-full max-w-md">
        <Button fullWidth onClick={handleClick}>
          Full Width Button
        </Button>
      </div>

      {/* Real Use Cases */}
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={handleClick}>로그인</Button>
        <Button variant="secondary" onClick={handleClick}>
          취소
        </Button>
        <Button variant="outline" onClick={handleClick}>
          더보기
        </Button>
        <Button
          variant="primary"
          rightIcon={<span>✓</span>}
          onClick={handleClick}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
