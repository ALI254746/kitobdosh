'use client'
 
export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h2 className="text-3xl font-black mb-2 text-red-500">Voy! 😕</h2>
      <p className="text-lg mb-6 font-medium">Nimadir noto'g'ri ketdi.</p>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 max-w-md overflow-auto">
         <code className="text-sm text-red-400">{error.message}</code>
      </div>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#1F2937] text-white rounded-xl font-bold hover:bg-[#96C7B9] transition-all shadow-lg shadow-gray-200"
      >
        Qayta urinib ko'rish
      </button>
    </div>
  )
}
