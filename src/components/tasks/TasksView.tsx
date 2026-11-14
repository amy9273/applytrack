"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Building,
  CheckCircle2,
  Plus,
  FileText,
  UserCheck,
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  company: string;
  category: "DOCUMENT" | "ASSESSMENT" | "FOLLOWUP" | "SCHOOL_MOA";
  assignedTo: "ME" | "COMPANY" | "SCHOOL";
  dueDate?: string;
  completed: boolean;
}

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "task-1",
      title: "Request De La Salle Lipa Endorsement Letter & MOA for GlobalTransco",
      company: "Global Transco ICT Solutions",
      category: "SCHOOL_MOA",
      assignedTo: "SCHOOL",
      dueDate: "Nov 25, 2026",
      completed: false,
    },
    {
      id: "task-2",
      title: "Complete Citco HackerRank Technical Coding Assessment (90 mins)",
      company: "Citco Group Philippines",
      category: "ASSESSMENT",
      assignedTo: "ME",
      dueDate: "Nov 20, 2026",
      completed: false,
    },
    {
      id: "task-3",
      title: "Confirm Google Meet Attendance with Maria Reyes (Citco Senior Recruiter)",
      company: "Citco Group Philippines",
      category: "FOLLOWUP",
      assignedTo: "ME",
      dueDate: "Nov 21, 2026",
      completed: true,
    },
    {
      id: "task-4",
      title: "Prepare Zoom Room & System Architecture Portfolio for StellarPH",
      company: "StellarPH",
      category: "ASSESSMENT",
      assignedTo: "ME",
      dueDate: "Nov 19, 2026",
      completed: false,
    },
    {
      id: "task-5",
      title: "Waiting on Round 1 shortlist decision from Thinking Machines",
      company: "Thinking Machines Data Science",
      category: "FOLLOWUP",
      assignedTo: "COMPANY",
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const getCategoryBadge = (cat: TaskItem["category"]) => {
    switch (cat) {
      case "SCHOOL_MOA":
        return <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 border border-purple-200">School & MOA Requirement</span>;
      case "ASSESSMENT":
        return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">Technical Exam</span>;
      case "FOLLOWUP":
        return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">HR Follow-up</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200">Task</span>;
    }
  };

  const getResponsibilityBadge = (assigned: TaskItem["assignedTo"]) => {
    switch (assigned) {
      case "ME":
        return <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">Action Required: Me</span>;
      case "SCHOOL":
        return <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">Action: De La Salle Lipa</span>;
      case "COMPANY":
        return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">Waiting on Company</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Tasks & School MOA Tracking</h2>
        <p className="text-xs text-slate-500">
          Pending requirements, university endorsements, and recruiter follow-ups.
        </p>
      </div>

      {/* Task list */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`rounded-2xl border p-4 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
              task.completed
                ? "border-slate-200 bg-slate-50/60 opacity-60"
                : "border-slate-200/90 bg-white hover:border-blue-400"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{task.company}</span>
                  {getCategoryBadge(task.category)}
                  {getResponsibilityBadge(task.assignedTo)}
                </div>
                <h4
                  className={`text-xs font-semibold ${
                    task.completed ? "line-through text-slate-400" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </h4>
              </div>
            </div>

            {task.dueDate && (
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
                  Due: {task.dueDate}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
