/**
 * @file page.tsx
 * @description Kullanıcının projelerini ve ilgili görevleri listeleyen gösterge paneli (dashboard) sayfası.
 * Kullanıcının rolüne ve token'ına göre backend'den proje ve görev verileri çekilir, socket.io ile gerçek zamanlı bildirim alınır.
 * Görevler duruma ve önceliğe göre etiketlenerek kullanıcıya sunulur.
 * @module app/(dashboard)/dashboard
 */

"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import socket from "@/lib/socket";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProjectsAndTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projects = res.data;
        setProjects(projects);

        const tasksMap: Record<string, Task[]> = {};
        for (const project of projects) {
          const taskRes = await axios.get(
            `http://localhost:5001/projects/${project._id}/tasks`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          tasksMap[project._id] = taskRes.data;
        }
        setProjectTasks(tasksMap);
      } catch (err) {
        console.error("Veriler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndTasks();
  }, [token, router]);

  useEffect(() => {
  if (!user) return;

  console.log("Dashboard WebSocket listener aktif");

  socket.on("taskCreated", (task: Task) => {
    if (task.assignedTo?._id === user._id) {
      toast.info(`📌 Size yeni görev atandı: ${task.title}`);

      setProjectTasks((prev) => ({
        ...prev,
        [task.project]: [...(prev[task.project] || []), task],
      }));
    }
  });

  socket.on("task-updated", (task: Task) => {
    if (task.assignedTo?._id === user._id) {
      toast.success(`✏️ Görev güncellendi: ${task.title}`);

      setProjectTasks((prev) => ({
        ...prev,
        [task.project]: prev[task.project]?.map((t) =>
          t._id === task._id ? task : t
        ) || [],
      }));
    }
  });

  return () => {
    socket.off("taskCreated");
    socket.off("task-updated");
  };
}, [user]);


  const createProject = async (name: string, description: string) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/projects",
        { name, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects((prev) => [...prev, res.data]);
      setProjectTasks((prev) => ({ ...prev, [res.data._id]: [] }));
      setShowProjectForm(false);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (err) {
      console.error("Proje oluşturulamadı:", err);
    }
  };

  const Tag = ({ text, color }: { text: string; color: string }) => {
    const colorClasses: Record<string, string> = {
      yellow: "bg-yellow-100 text-yellow-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      gray: "bg-gray-200 text-gray-700",
    };
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[color] || colorClasses.gray}`}>{text}</span>
    );
  };

  const statusColorMap: Record<string, string> = {
    pending: "yellow",
    "in-progress": "blue",
    completed: "green",
  };

  const priorityColorMap: Record<string, string> = {
    low: "green",
    medium: "yellow",
    high: "red",
  };

  const allTasks = Object.values(projectTasks).flat();
  const completedCount = allTasks.filter((t) => t.status === "completed").length;
  const inProgressCount = allTasks.filter((t) => t.status === "in-progress").length;
  const pendingCount = allTasks.filter((t) => t.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <span className="text-gray-600 text-sm">
          Hoş geldin, <span className="text-blue-600 font-semibold">{user?.name}</span>
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Toplam Proje</h2>
          <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Toplam Görev</h2>
          <p className="text-2xl font-bold text-yellow-500">{allTasks.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Tamamlanan</h2>
          <p className="text-2xl font-bold text-green-500">{completedCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Devam Eden</h2>
          <p className="text-2xl font-bold text-blue-500">{inProgressCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Bekleyen</h2>
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Projeler</h2>
          {!showProjectForm && (
            <button
              onClick={() => setShowProjectForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              + Yeni Proje
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="w-[300px] bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col"
            >
              <h3
                onClick={() => router.push(`/projects/${project._id}`)}
                className="text-lg font-bold text-gray-700 cursor-pointer hover:underline"
              >
                {project.name}
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                {projectTasks[project._id]?.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className="bg-white p-3 rounded-xl shadow border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="font-semibold text-sm text-gray-800">{task.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs items-center">
                      <Tag text={task.status} color={statusColorMap[task.status]} />
                      <Tag text={task.priority} color={priorityColorMap[task.priority]} />
                      <span className="ml-auto text-gray-500">👤 {task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                  </div>
                ))}
                {projectTasks[project._id]?.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No tasks</p>
                )}
              </div>
            </div>
          ))}

          {showProjectForm && (
            <div className="w-[300px] bg-white border border-gray-300 rounded-xl p-4 shadow flex flex-col gap-3">
             <input
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border px-3 py-2 rounded text-sm focus:ring focus:border-blue-500 text-gray-800"
            />
              <textarea
                placeholder="Project Description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="border px-3 py-2 rounded text-sm resize-none focus:ring focus:border-blue-500 text-gray-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowProjectForm(false)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  İptal
                </button>
                <button
                  onClick={() => createProject(newProjectName, newProjectDescription)}
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Oluştur
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}