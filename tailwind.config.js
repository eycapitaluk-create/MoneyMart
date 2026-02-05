/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // ▼▼▼ 다크모드 설정 (필수) ▼▼▼
  darkMode: 'class', 
  
  theme: {
    extend: {
      // 애니메이션 설정 (앱에서 부드럽게 뜨는 효과용)
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}