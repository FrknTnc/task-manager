/**
 * @file page.tsx
 * @description Belirli bir projenin detaylarını, görevlerini ve geçmiş task loglarını gösteren sayfa.
 * Gerçek zamanlı WebSocket entegrasyonu ile görev oluşturma ve güncellemeler izlenir. Kullanıcı filtreleme ve sıralama ile görevleri yönetebilir.
 * @module app/(dashboard)/projects/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Task, TaskLog } from "@/types/task";
import TaskForm from "@/components/TaskForm";
import Link from "next/link";
import socket from "@/lib/socket";
import { toast } from "react-toastify";


export default function ProjectDetailPage() {
  const { token } = useSelector((state: RootState) => state.auth);
  const params = useParams();
  const projectId = params.id as string;

  const [projectInfo, setProjectInfo] = useState<{ name: string; description?: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredTasks = tasks
    .filter((task) => filterStatus === "all" || task.status === filterStatus)
    .sort((a, b) => {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return sortOrder === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const fetchProject = async () => {
    if (!projectId || !token) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectInfo(res.data);
    } catch (err) {
      console.error("Proje bilgileri alınamadı:", err);
    }
  };

  const fetchTasks = async () => {
    if (!projectId || !token) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Görevler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId, token]);

  useEffect(() => {
  console.log("🔁 WebSocket useEffect triggered");

  socket.on("taskCreated", (task) => {
    console.log("🆕 taskCreated event received:", task);

    toast.info(`📌 Yeni görev geldi: ${task.title}`);
    fetchTasks();
  });

  socket.on("task-updated", (task) => {
    console.log("✏️ task-updated event received:", task);

    toast.success(`✏️ Görev güncellendi: ${task.title}`);
    fetchTasks();
  });

  return () => {
    socket.off("taskCreated");
    socket.off("task-updated");
  };
}, [user, projectId]);


  const fetchLogs = async (taskId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Loglar alınamadı:", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    fetchLogs(task._id);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      console.error("Görev silinemedi:", err);
    }
  };

  const taskCounts = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };


  return (
  <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-6">
      <Link href="/dashboard">
        <h1 className="text-xl font-bold text-gray-800 hover:underline cursor-pointer">Dashboard</h1>
      </Link>
      <span className="text-gray-600 text-sm">
        Hoş geldin, <span className="text-blue-600 font-semibold">{user?.name}</span>
      </span>
    </header>

    <div className="max-w-6xl mx-auto px-4 pb-16"> 

      {projectInfo && (
        <div className="mt-12 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{projectInfo.name}</h1>
          {projectInfo.description && (
            <p className="text-md text-gray-600 max-w-2xl mx-auto">{projectInfo.description}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Toplam Görev</h2>
          <p className="text-2xl font-bold text-yellow-500">{taskCounts.total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Tamamlanan</h2>
          <p className="text-2xl font-bold text-green-500">{taskCounts.completed}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Devam Eden</h2>
          <p className="text-2xl font-bold text-blue-500">{taskCounts.inProgress}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Bekleyen</h2>
          <p className="text-2xl font-bold text-yellow-500">{taskCounts.pending}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
            <button
              onClick={() => {
                setSelectedTask(null);
                setLogs([]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm font-medium"
            >
              + Yeni Görev Oluştur
            </button>
          </div>

          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="relative w-40">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">▼</div>
            </div>

            <div className="relative w-40">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="asc">Öncelik: Artan</option>
                <option value="desc">Öncelik: Azalan</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">▼</div>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks available.</p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:bg-gray-50 transition"
                  onClick={() => handleTaskClick(task)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {task.status}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "low"
                        ? "bg-green-100 text-green-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {task.priority}
                    </span>

                    <span className="ml-auto text-gray-500 text-xs">
                      👤 {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-end gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                      className="flex items-center gap-1 border border-green-500 text-green-600 hover:bg-green-50 px-3 py-1 rounded-full text-xs font-medium transition"
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task._id);
                      }}
                      className="flex items-center gap-1 border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1 rounded-full text-xs font-medium transition"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <TaskForm
            projectId={projectId}
            taskToEdit={selectedTask}
            onSuccess={() => {
              fetchTasks();
              setSelectedTask(null);
            }}
          />
        </div>
      </div>

      {selectedTask && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Task Logs</h2>
          <div className="bg-white border rounded shadow p-4 space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No logs found for this task.</p>
            ) : (
              <ul className="space-y-4">
                {logs.map((log) => (
                  <li key={log._id} className="text-sm text-gray-800 border rounded p-4 bg-gray-50">
                    <p className="mb-2 font-semibold">
                      {log.changedBy.name} updated on {new Date(log.changedAt).toLocaleString()}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Başlık:</span> {log.previousData.title}</p>
                      <p><span className="font-medium">Açıklama:</span> {log.previousData.description}</p>
                      <p><span className="font-medium">Durum:</span>{" "}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          log.previousData.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : log.previousData.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {log.previousData.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Öncelik:</span>{" "}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          log.previousData.priority === "low"
                            ? "bg-green-100 text-green-800"
                            : log.previousData.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {log.previousData.priority}
                        </span>
                      </p>
                      <p><span className="font-medium">Atanan:</span> {log.previousData.assignedTo || "Bilinmiyor"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div> 
  </div>
);
}
