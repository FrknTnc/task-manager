/**
 * @file page.tsx
 * @description Kullanıcı giriş (login) sayfasını içerir. E-posta ve şifre ile kullanıcı girişini sağlar.
 * Redux üzerinden kimlik doğrulama işlemi yapılır ve başarılı giriş sonrası kullanıcı dashboard sayfasına yönlendirilir.
 * @module app/(auth)/login
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800">Welcome</h2>
          <p className="text-sm text-center text-gray-600">Login to your account</p>
        </div>

        {typeof error === 'string' && (
  <p className="text-red-500 text-sm text-center">{error}</p>)}


        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 text-gray-900"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 text-gray-900"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" className="form-checkbox text-blue-600" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-700 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >
            {loading ? "Signing in..." : "Sign in to your account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
