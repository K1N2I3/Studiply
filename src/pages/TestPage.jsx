import React from 'react'

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Application is Working!</h1>
        <p className="text-gray-600 mb-4">
          If you can see this page, the basic React application is running correctly.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• React is rendering</p>
          <p>• Tailwind CSS is working</p>
          <p>• Routing is functional</p>
          <p>• No JavaScript errors</p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}

export default TestPage
