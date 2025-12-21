
export default function AuthorCard({ author }) {
  return (
    <div className="min-w-44 bg-white rounded-2xl p-4 shadow-sm text-center flex-shrink-0 hover:shadow-md transition">
      <img
        src={author?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
        alt={author?.name}
        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-100"
      />

      <h3 className="font-bold text-gray-800 text-sm mb-1">{author?.name || "Noma'lum muallif"}</h3>

      <p className="text-xs text-gray-500 mb-3">{author?.books || 0} ta kitob</p>

      <button className="w-full bg-blue-100 text-blue-600 py-2 rounded-xl text-xs font-semibold hover:bg-blue-200 transition">
        Ko‘rish
      </button>
    </div>
  );
}
