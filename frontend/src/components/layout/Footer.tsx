import React from "react";
import { Mail, Github } from "lucide-react";

/**
 * 웹사이트의 표준 푸터(Footer) 컴포넌트
 * 회사 정보, 네비게이션 링크, 소셜 미디어 링크, 저작권 정보를 포함합니다.
 */
const Footer = (): React.ReactElement => {
  const currentYear = new Date().getFullYear();

  const FooterLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <li>
      <a
        href={href}
        className="text-gray-500 transition-colors duration-300 hover:text-gray-900"
      >
        {children}
      </a>
    </li>
  );

  return (
    <footer className="z-50 w-full text-gray-700 bg-white border-t border-gray-200">
      <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* 저작권 정보 */}
          <p className="text-sm text-gray-500">
            &copy; {currentYear} All Rights Reserved.
          </p>

          <div className="flex space-x-6">
            {/*회사정보*/}
            <FooterLink href="#">이용약관</FooterLink>
            <FooterLink href="#">개인정보처리방침</FooterLink>
            {/* 소셜 미디어 링크 */}
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <Mail size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
