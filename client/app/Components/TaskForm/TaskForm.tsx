"use client";
import { useTasks } from "@/context/taskContext";
import React from "react";

interface TaskFormProps {
  onSubmit: (e: React.FormEvent) => void;
  mode: 'create' | 'edit';
}

function TaskForm({ onSubmit, mode }: TaskFormProps) {
  const { task, handleInput } = useTasks();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={(e) => handleInput("title")(e)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={(e) => handleInput("description")(e)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Enter task description"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="priority" className="text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={(e) => handleInput("priority")(e)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="dueDate" className="text-gray-700">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={task.dueDate}
          onChange={(e) => handleInput("dueDate")(e)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className={`mt-4 py-2 px-4 rounded-md text-white font-medium ${mode === 'edit' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} transition-colors`}
      >
        {mode === 'edit' ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}

export default TaskForm;