"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
function Section2() {
  const [animate1, setAnimate1] = useState(false);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true); // sahifaga kirganda bir martalik animatsiya
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate1(true), 200);
    return () => clearTimeout(timer);
  }, []);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.4, // 20% ko‘rinsa animatsiya boshlanadi
    triggerOnce: false, // har safar chiqib/kirganda animatsiya ishlaydi
    rootMargin: "200px",
  });
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const fadeVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const features = [
    {
      title: "Vaqt tejaydi",
      desc: "Kitoblarni tezda topib, onlayn buyurtma bering",
      iconColor: "from-blue-500 to-cyan-500",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
        </svg>
      ),
    },
    {
      title: "Tez yetkazish",
      desc: "Kitoblaringiz 24 soat ichida yetkaziladi",
      iconColor: "from-green-500 to-teal-500",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 640 512"
        >
          <path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
        </svg>
      ),
    },
    {
      title: "Keng kitob tanlovi",
      desc: "Barcha fanlar bo'yicha minglab kitoblar",
      iconColor: "from-purple-500 to-pink-500",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7zM40.6,272H8.5c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272zM40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6C14.7,194.3,10,216.7,8.5,240H40.6zM64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5L64.3,156.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="about-section"
      className="py-1 px-6 bg-white" // orqa fon oq
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header animation */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 1.2 } },
            hidden: { opacity: 0, y: 50 },
          }}
          className="text-center py-16 px-4"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Feruza Book nima?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Feruza Book — bu talabalarga o‘zlariga kerakli kitoblarni ijaraga
            olish yoki sotib olish imkonini beruvchi platformadir. Maqsadimiz —
            bilimni har kim uchun qulay va arzon qilish.
          </p>
        </motion.div>
        {/* Features animation */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 40 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.08,
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="p-8 text-center bg-amber-50 rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-2xl"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className={`w-16 h-16 bg-gradient-to-r ${feature.iconColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-md`}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <section id="stats-section" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            ref={ref}
            variants={fadeVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          >
            {/* Stat 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                >
                  <path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-black mb-2">904+</div>
              <p className="text-gray-600">Books Available</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-black mb-2">1,200+</div>
              <p className="text-gray-600">Active Users</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-black mb-2">15+</div>
              <p className="text-gray-600">Academic Subjects</p>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-black mb-2">24/7</div>
              <p className="text-gray-600">Access Available</p>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Kategoriya bo‘yicha ko‘rib chiqish
          </h3>
          <p className="text-gray-600">
            O‘qishingiz uchun ideal akademik resurslarni toping
          </p>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Biologiya */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="text-green-600 w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.2 5.4c-25.9 5.9-50 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"
                ></path>
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Biologiya
            </h4>
            <p className="text-gray-600 text-center mb-4">
              Hujayra biologiyasi, genetika, ekologiya va boshqalar
            </p>
            <div className="text-center">
              <span className="text-sm text-gray-500">247 ta kitob mavjud</span>
            </div>
          </div>

          {/* Kimyo */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="text-purple-600 w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M288 0H160 128C110.3 0 96 14.3 96 32s14.3 32 32 32V196.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512H378.6c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H288zM192 196.8V64h64V196.8c0 23.7 6.6 46.9 19 67.1L309.5 320h-171L173 263.9c12.4-20.2 19-43.4 19-67.1z"
                ></path>
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Kimyo
            </h4>
            <p className="text-gray-600 text-center mb-4">
              Organik, noorganik va analitik kimyo
            </p>
            <div className="text-center">
              <span className="text-sm text-gray-500">189 ta kitob mavjud</span>
            </div>
          </div>

          {/* Fizika */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="text-blue-600 w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 398.8c-11.8 5.1-23.4 9.7-34.9 13.5c16.7 33.8 31 35.7 34.9 35.7s18.1-1.9 34.9-35.7c-11.4-3.9-23.1-8.4-34.9-13.5zM446 256c33 45.2 44.3 90.9 23.6 128c-20.2 36.3-62.5 49.3-115.2 43.2c-22 52.1-55.6 84.8-98.4 84.8s-76.4-32.7-98.4-84.8c-52.7 6.1-95-6.8-115.2-43.2C21.7 346.9 33 301.2 66 256c-33-45.2-44.3-90.9-23.6-128c20.2-36.3 62.5-49.3 115.2-43.2C179.6 32.7 213.2 0 256 0s76.4 32.7 98.4 84.8c52.7-6.1 95 6.8 115.2 43.2c20.7 37.1 9.4 82.8-23.6 128zm-65.8 67.4c-1.7 14.2-3.9 28-6.7 41.2c31.8 1.4 38.6-8.7 40.2-11.7c2.3-4.2 7-17.9-11.9-48.1c-6.8 6.3-14 12.5-21.6 18.6zm-6.7-175.9c2.8 13.1 5 26.9 6.7 41.2c7.6 6.1 14.8 12.3 21.6 18.6c18.9-30.2 14.2-44 11.9-48.1c-1.6-2.9-8.4-13-40.2-11.7zM290.9 99.7C274.1 65.9 259.9 64 256 64s-18.1 1.9-34.9 35.7c11.4 3.9 23.1 8.4 34.9 13.5c11.8-5.1 23.4-9.7 34.9-13.5zm-159 88.9c1.7-14.3 3.9-28 6.7-41.2c-31.8-1.4-38.6 8.7-40.2 11.7c-2.3 4.2-7 17.9 11.9 48.1c6.8-6.3 14-12.5 21.6-18.6zM110.2 304.8C91.4 335 96 348.7 98.3 352.9c1.6 2.9 8.4 13 40.2 11.7c-2.8-13.1-5-26.9-6.7-41.2c-7.6-6.1-14.8-12.3-21.6-18.6zM336 256a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zm-80-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                ></path>
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Fizika
            </h4>
            <p className="text-gray-600 text-center mb-4">
              Mexanika, termodinamika, kvant fizika
            </p>
            <div className="text-center">
              <span className="text-sm text-gray-500">156 ta kitob mavjud</span>
            </div>
          </div>

          {/* Adabiyot */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="text-orange-600 w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M373.5 27.1C388.5 9.9 410.2 0 433 0c43.6 0 79 35.4 79 79c0 22.8-9.9 44.6-27.1 59.6L277.7 319l-10.3-10.3-64-64L193 234.3 373.5 27.1zM170.3 256.9l10.4 10.4 64 64 10.4 10.4-19.2 83.4c-3.9 17.1-16.9 30.7-33.8 35.4L24.4 510.3l95.4-95.4c2.6 .7 5.4 1.1 8.3 1.1c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32c0 2.9 .4 5.6 1.1 8.3L1.7 487.6 51.5 310c4.7-16.9 18.3-29.9 35.4-33.8l83.4-19.2z"
                ></path>
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Adabiyot
            </h4>
            <p className="text-gray-600 text-center mb-4">
              Klassik va zamonaviy adabiy asarlar
            </p>
            <div className="text-center">
              <span className="text-sm text-gray-500">312 ta kitob mavjud</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section2;
