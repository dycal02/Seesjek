"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validasi saat mengetik
    if (newPassword.length < 8 && newPassword.length > 0) {
      setError("Password harus minimal 8 karakter");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password minimal 8 karakter
    if (password.length < 8) {
      setError("Password harus minimal 8 karakter");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login berhasil, redirect ke dashboard
        router.push('/dashboard');
      } else {
        // Login gagal, tampilkan error
        setError(data.error || 'Login gagal');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f9] to-[#e8f4f4] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Circle Top Left */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#25AEAE] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Circle Bottom Right */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#25AEAE] rounded-full opacity-10 translate-x-1/2 translate-y-1/2"></div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border-2 border-[#25AEAE] animate__animated animate__fadeInUp relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#25AEAE] rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">L</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#25AEAE] mb-2">
          Login
        </h1>
        <p className="text-center text-[#72A5A5] mb-8">
          Selamat datang kembali
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#25AEAE] mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#25AEAE] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Masukkan password Anda"
              className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              required
            />
            {/* Error Message & Password Info */}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-[#72A5A5]">Minimal 8 karakter</p>
              {error && (
                <div className="text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>


          {/* Forgot Password */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-[#72A5A5] hover:text-[#25AEAE] transition"
            >
              Lupa password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || error !== ""}
            className="w-full bg-[#25AEAE] hover:bg-[#1e8a8a] text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                Loading
                <span
                  className="animate__animated animate__bounce inline-block ml-1"
                  style={{ animationDuration: "0.6s" }}
                >
                  .
                </span>
                <span
                  className="animate__animated animate__bounce inline-block"
                  style={{ animationDuration: "0.6s", animationDelay: "0.1s" }}
                >
                  .
                </span>
                <span
                  className="animate__animated animate__bounce inline-block"
                  style={{ animationDuration: "0.6s", animationDelay: "0.2s" }}
                >
                  .
                </span>
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
