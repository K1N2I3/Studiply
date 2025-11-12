import React from 'react'

// 成功图标 - 简洁的绿色圆圈配白色勾号
export const SuccessIcon = ({ className = "w-6 h-6" }) => (
  <div className={`${className} relative`}>
    {/* 绿色圆圈背景 */}
    <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-lg">
      {/* 白色勾号 */}
      <svg 
        className="w-3/5 h-3/5 text-white" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
    {/* 发光效果 */}
    <div className="absolute inset-0 bg-green-400 rounded-full opacity-0 animate-pulse"></div>
  </div>
)

// 错误图标 - 保持原有的红色X图标
export const ErrorIcon = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2"/>
    <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2"/>
  </svg>
)

// 警告图标 - 保持原有的黄色三角图标
export const WarningIcon = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} text-yellow-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
  </svg>
)

// 信息图标 - 使用你提供的设计：深灰色圆圈配白色S形图案和绿色竖条
export const InfoIcon = ({ className = "w-6 h-6" }) => (
  <div className={`${className} relative`}>
    {/* 浅绿色背景，右下角圆角 */}
    <div className="absolute -inset-2 bg-green-100 rounded-br-lg rounded-tl-lg -z-10"></div>
    
    {/* 左侧绿色竖条 */}
    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-3 bg-green-500 rounded-full"></div>
    
    {/* 深灰色圆圈背景 */}
    <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center relative overflow-hidden">
      {/* 白色S形图案 - 使用更准确的螺旋设计 */}
      <div className="relative w-3/5 h-3/5 flex items-center justify-center">
        <svg 
          className="w-full h-full text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          {/* 螺旋形图案，类似地球仪上的线条 */}
          <path d="M12 2c-2.5 0-4.8 1-6.5 2.7C3.8 6.4 3 8.6 3 11c0 2.4.8 4.6 2.5 6.3C7.2 19 9.5 20 12 20s4.8-1 6.5-2.7C20.2 15.6 21 13.4 21 11s-.8-4.6-2.5-6.3C16.8 3 14.5 2 12 2zm0 2c1.8 0 3.4.7 4.6 1.9C17.8 7.1 18.5 8.7 18.5 10.5s-.7 3.4-1.9 4.6c-1.2 1.2-2.8 1.9-4.6 1.9s-3.4-.7-4.6-1.9C6.2 13.9 5.5 12.3 5.5 10.5s.7-3.4 1.9-4.6C8.7 4.7 10.3 4 12 4z"/>
          <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>
    </div>
  </div>
)
