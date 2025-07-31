/**
 * @file CreateProjectModal.tsx
 * @description Yeni bir proje oluşturmak için açılır modal bileşeni. Kullanıcıdan proje adı ve açıklaması alır.
 * Başarılı giriş sonrası `onCreate` callback fonksiyonunu tetikler ve modal'ı kapatır.
 * @module components/CreateProjectModal
 */

"use client";

import { useState } from "react";

export default function CreateProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (name.trim() === "") return;
    onCreate(name, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create New Project
        </h2>
        <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700"
            />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
