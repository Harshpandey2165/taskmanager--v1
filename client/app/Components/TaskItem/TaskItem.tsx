import { useTasks } from "@/context/taskContext";
import { Edit, Star, Trash } from "@/utils/Icons";
import { Task } from "@/utils/types";
import { formatTime } from "@/utils/utilities";
import React from "react";
import { motion } from "framer-motion";
import { item } from "@/utils/animations";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-red-500";
    }
  };

  const { getTask, openModalForEdit, deleteTask, modalMode } = useTasks();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 h-[16rem] flex flex-col justify-between"
      variants={item}
    >
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-semibold text-gray-800 truncate">{task.title}</h4>
        <p className="text-gray-600 line-clamp-2 text-[15px] min-h-[3em]">{task.description}</p>
      </div>
      <div className="flex flex-col gap-3">
        <span className={`w-fit px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getPriorityColor(task.priority) === 'text-red-500' ? 'bg-red-100 text-red-800' : getPriorityColor(task.priority) === 'text-yellow-500' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {task.priority}
        </span>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            {formatTime(task.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            <button
              className={`p-1.5 rounded-full transition-colors ${task.completed ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {<Star />}
            </button>
            <button
              className="text-[#7263F3] hover:text-[#5B4EE6] transition-colors p-1.5 hover:bg-purple-50 rounded-full"
              onClick={() => {
                getTask(task._id);
                openModalForEdit(task);
              }}
            >
              {<Edit />}
            </button>
            <button
              className="text-red-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-full"
              onClick={() => {
                deleteTask(task._id);
              }}
            >
              {<Trash />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskItem;
