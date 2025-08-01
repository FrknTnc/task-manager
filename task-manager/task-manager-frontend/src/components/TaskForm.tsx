/**
 * @file TaskForm.tsx
 * @description Görev oluşturma ve düzenleme formu bileşenidir. Projeye ait yeni görevler eklemeye veya mevcut görevleri güncellemeye olanak tanır.
 * @module components/TaskForm
 */

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { User } from "@/types/user";
import type { Task } from "@/types/task";

interface Props {
  projectId: string;
  onSuccess: () => void;
  taskToEdit?: Task | null;
}

export default function TaskForm({ projectId, onSuccess, taskToEdit }: Props) {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    assignedTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assignedTo: taskToEdit.assignedTo?._id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        assignedTo: "",
      });
    }
  }, [taskToEdit]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://task-manager-02q1.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Kullanıcılar alınamadı:", err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (taskToEdit) {
        await axios.put(
          `https://task-manager-02q1.onrender.com/tasks/${taskToEdit._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `https://task-manager-02q1.onrender.com/projects/${projectId}/tasks`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        assignedTo: "",
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "İşlem başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {taskToEdit ? "Görev Güncelle" : "Yeni Görev Oluştur"}
        </h2>
        <p className="text-sm text-center text-gray-600">
          {taskToEdit
            ? "Seçilen görevi güncelleyin"
            : "Projenize yeni bir görev ekleyin"}
        </p>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Başlık"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ▼
          </div>
        </div>

        <div className="relative">
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ▼
          </div>
        </div>

        <div className="relative">
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kullanıcı Seç</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
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
          {loading ? "İşleniyor..." : taskToEdit ? "Güncelle" : "Görev Oluştur"}
        </button>
      </form>

    </div>
  );
}
