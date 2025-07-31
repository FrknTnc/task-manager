/**
 * @file page.tsx
 * @description Kullanıcı kayıt (register) sayfasını içerir. Form aracılığıyla kullanıcı bilgilerini alır ve Redux üzerinden kimlik oluşturma işlemi yapar.
 * Başarılı kayıt sonrası kullanıcıya Toast mesajı gösterilir ve login sayfasına yönlendirilir.
 * @module app/(auth)/register
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Developer",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800">Create an account</h2>
          <p className="text-sm text-center text-gray-600">Start managing your tasks</p>
        </div>

        {typeof error === "string" && (
          <p className="text-red-500 text-sm text-center">{error}</p>
      )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="relative">
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ▼
            </div>
            </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in here
          </a>
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
