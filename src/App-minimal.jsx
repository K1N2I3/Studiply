import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Studiply</h1>
        <p className="text-gray-600 mb-4">
          Minimal version is working. The issue might be with one of the components.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reload Full App
        </button>
      </div>
    </div>
  )
}

export default App
