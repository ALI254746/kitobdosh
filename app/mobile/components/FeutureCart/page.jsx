"use client";

export default function FeaturedBookCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-[#6DD5FA] shadow-soft text-white p-6">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

      {/* Content */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="w-2/3">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-semibold mb-2">
            🔥 Bugungi chegirma
          </span>
          <h3 className="text-xl font-bold font-heading leading-tight mb-1">
            Eng ko‘p o‘qilgan kitoblar
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Barcha bestsellerlarga 20% chegirma
          </p>
          <button className="px-5 py-2 bg-white text-primary rounded-xl text-sm font-bold shadow-lg hover:bg-gray-50 transition-colors">
            Ko'rish
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <img
            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            alt="Book"
            className="w-20 h-28 object-cover rounded-lg shadow-2xl transform rotate-6 border-2 border-white/30"
          />
        </div>
      </div>
    </section>
  );
}
