import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
function Page() {
  return (
    <div>
      {/* HEADER */}
      {/* SEARCH & FILTER SECTION */}
      <section id="search-filter" className="bg-white ">
        <div className="max-w-7xl mx-auto px-6 py-15">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* SEARCH INPUT */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for books, authors, or bookstores..."
                    className="w-full  text-black pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <i className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 
                      0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 
                      40-122.7 40C93.1 416 0 322.9 0 208S93.1 
                      0 208 0S416 93.1 416 208zM208 352a144 
                      144 0 1 0 0-288 144 144 0 1 0 0 288z"
                      />
                    </svg>
                  </i>
                </div>
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-4">
                <select className="px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Katigoriyalar</option>
                  <option>ilmiy</option>
                  <option>Badiy</option>
                  <option>fantastik</option>
                </select>

                <select className="px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Do'konlar</option>
                  <option>BookCity</option>
                  <option>Kitoblar.uz</option>
                  <option>QamarBook</option>
                </select>

                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-32 accent-blue-500"
                />

                <select className="px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Saaralash</option>
                  <option>Arzonroq</option>
                  <option>o'rtacha</option>
                  <option>Yuqori</option>
                </select>

                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Qidiruv
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <main id="main-content" class=" bg-white pb-10">
        <div class="max-w-7xl mx-auto px-6">
          <div
            id="book-grid"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <div class="book-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div class="relative">
                <img
                  class="w-full h-64 object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/25745aa5fc-be88d0bb286347101d2b.png"
                  alt="modern biology textbook cover with colorful illustrations"
                />
                <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  yangi
                </div>
              </div>
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-primary text-white px-2 py-1 rounded text-xs">
                    BookCity
                  </span>
                  <button class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-fa-i2svg="">
                      <svg
                        class="svg-inline--fa fa-heart"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="heart"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                        ></path>
                      </svg>
                    </i>
                  </button>
                </div>
                <h3 class="font-semibold text-black text-lg mb-1">Zamonaviy</h3>
                <p class="text-gray-600 text-sm mb-2">by Dr. Sarah Johnson</p>
                <div class="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <span class="text-gray-600 text-sm ml-2">4.2 (156)</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-bold text-blue-500 ">$45.99</span>
                  <span class="text-gray-500 line-through">$55.99</span>
                </div>
                <div class="flex gap-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                    </svg>
                    Savatchaga
                  </button>
                  <button className="flex-1 bg-yellow-400 text-black py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-yellow-500 active:scale-95">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z" />
                    </svg>
                    sotib ol
                  </button>
                </div>
              </div>
            </div>

            <div class="book-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div class="relative">
                <img
                  class="w-full h-64 object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/9b4b0d5ffc-14429b36cbaf686cd17a.png"
                  alt="chemistry textbook with molecular structures and periodic table"
                />
                <div class="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  New
                </div>
              </div>
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-green-600 text-white px-2 py-1 rounded text-xs">
                    Kitoblar.uz
                  </span>
                  <button class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-fa-i2svg="">
                      <svg
                        class="svg-inline--fa fa-heart"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="heart"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                        ></path>
                      </svg>
                    </i>
                  </button>
                </div>
                <h3 class="font-semibold text-black text-lg mb-1">
                  Advanced Chemistry
                </h3>
                <p class="text-gray-600 text-sm mb-2">by Prof. Michael Chen</p>
                <div class="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <span class="text-gray-600 text-sm ml-2">4.8 (203)</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-bold text-blue-600">$52.99</span>
                </div>
                <div class="flex gap-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                    </svg>
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-yellow-400 text-black py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-yellow-500 active:scale-95">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div class="book-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <img
                class="w-full h-64 object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/607c096b87-40f40db40b3aaeb4c00c.png"
                alt="classic literature book with elegant typography design"
              />
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                    ReadMore
                  </span>
                  <button class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-fa-i2svg="">
                      <svg
                        class="svg-inline--fa fa-heart"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="heart"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                        ></path>
                      </svg>
                    </i>
                  </button>
                </div>
                <h3 class="font-semibold text-black text-lg mb-1">
                  World Literature
                </h3>
                <p class="text-gray-600 text-sm mb-2">by Various Authors</p>
                <div class="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <span class="text-gray-600 text-sm ml-2">4.5 (89)</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-bold text-blue-600">$38.99</span>
                </div>
                <div class="flex gap-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                    </svg>
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-yellow-400 text-black py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-yellow-500 active:scale-95">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div class="book-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <img
                class="w-full h-64 object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2d20d5d4c4-fdf914593cc48643a79c.png"
                alt="mathematics textbook with geometric patterns and formulas"
              />
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-primary text-white px-2 py-1 rounded text-xs">
                    BookCity
                  </span>
                  <button class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-fa-i2svg="">
                      <svg
                        class="svg-inline--fa fa-heart"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="heart"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                        ></path>
                      </svg>
                    </i>
                  </button>
                </div>
                <h3 class="font-semibold text-black text-lg mb-1">
                  Calculus &amp; Analysis
                </h3>
                <p class="text-gray-600 text-sm mb-2">by Dr. Emma Wilson</p>
                <div class="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <span class="text-gray-600 text-sm ml-2">4.3 (124)</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-bold text-blue-600">$49.99</span>
                </div>
                <div class="flex gap-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                    </svg>
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-yellow-400 text-black py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-yellow-500 active:scale-95">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 576 512"
                    >
                      <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <button
        className="
        fixed bottom-6 right-6 
        bg-yellow-400 text-black 
        w-14 h-14 rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all hover:scale-110 
        flex items-center justify-center
        z-50
      "
      >
        <FaShoppingCart className="text-2xl" />
      </button>{" "}
    </div>
  );
}

export default Page;
