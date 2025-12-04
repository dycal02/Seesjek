import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0f9f9] to-[#e8f4f4] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Circle Top Left */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#25AEAE] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Circle Bottom Right */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#25AEAE] rounded-full opacity-10 translate-x-1/2 translate-y-1/2"></div>

      {/* Content */}
      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-[#25AEAE] rounded-full flex items-center justify-center animate__animated animate__pulse">
            <span className="text-white text-5xl font-bold">L</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-[#25AEAE] mb-4 animate__animated animate__fadeInDown">
          Selamat Datang
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[#72A5A5] mb-12 animate__animated animate__fadeInUp">
          Sistem Manajemen Logistik Terpadu
        </p>

        {/* Description */}
        <p className="text-lg text-[#72A5A5] mb-8 max-w-2xl mx-auto animate__animated animate__fadeInUp" style={{ animationDelay: "0.2s" }}>
          Kelola pesanan, driver, dan pengguna dengan mudah.
        </p>

        {/* Button */}
        <Link
          href="/login"
          className="inline-block bg-[#25AEAE] hover:bg-[#1e8a8a] text-white font-semibold px-12 py-4 rounded-lg transition duration-200 shadow-lg animate__animated animate__fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          Masuk Sekarang
        </Link>

        {/* Footer */}
        <p className="text-[#72A5A5] text-sm mt-12">
          © 2025 Logistik Management. All rights reserved.
        </p>
      </div>
    </div>
  );
}
