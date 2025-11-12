import React from 'react'

const Debug = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Debug Page</h1>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <p className="text-gray-600">This is a debug page to test if routing is working correctly.</p>
        <div className="mt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Debug page is rendering successfully!
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug
