import React from 'react'

const MinimalTest = () => {
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: 'red', 
      color: 'white',
      fontSize: '30px',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>🔴 这是测试页面！</h1>
      <p>如果你能看到这个红色页面，说明路由系统工作正常！</p>
      <p>时间: {new Date().toLocaleString()}</p>
    </div>
  )
}

export default MinimalTest
