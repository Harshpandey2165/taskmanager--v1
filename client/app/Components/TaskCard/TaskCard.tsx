"use client";
import { useTasks } from "@/context/taskContext";
import React from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { openModalForEdit, deleteTask } = useTasks();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{task.title}</h3>
        <div className="flex gap-3">
          <button
            onClick={() => openModalForEdit(task)}
            className="text-[#7263F3] hover:text-[#5B4EE6] transition-colors p-1.5 hover:bg-purple-50 rounded-full"
          >
            <i className="fas fa-edit text-lg"></i>
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="text-red-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-full"
          >
            <i className="fas fa-trash-alt text-lg"></i>
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2 text-[15px]">{task.description}</p>
      
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(task.priority)} capitalize`}>
          {task.priority}
        </span>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 font-medium">
            Due: {formatDate(task.dueDate)}
          </span>
          <span className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-yellow-500'} shadow-sm`}></span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;