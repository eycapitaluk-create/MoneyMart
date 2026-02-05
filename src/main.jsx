// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // ★ 중요: 라우터 불러오기

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ★ 중요: App 컴포넌트를 BrowserRouter로 감싸야 합니다 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)