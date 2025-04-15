import axios from "axios";
import React, { createContext, useEffect, useContext } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface Task {
  _id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  userId?: string;
}

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  task: Task;
  isEditing: boolean;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  activeTask: Task | null;
  modalMode: string;
  profileModal: boolean;
  activeTasks: Task[];
  completedTasks: Task[];
  getTasks: () => Promise<void>;
  getTask: (taskId: string) => Promise<void>;
  createTask: (taskData: Task) => Promise<void>;
  updateTask: (taskData: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  openModalForAdd: () => void;
  openModalForEdit: (task: Task) => void;
  openProfileModal: () => void;
  closeModal: () => void;
  handleInput: (name: keyof Task | 'setTask') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string | Task) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}

const serverUrl = "http://localhost:8000/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure axios interceptor to handle authentication errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const userId = user?._id;

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState<Task>({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    completed: false
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      completed: false
    });
    setActiveTask(null);
  };

  const openModalForEdit = (task: Task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
    setTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      completed: false
    });
  };

  // get tasks
  const getTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
        toast.error("Invalid response format from server");
      }
    } catch (error: unknown) {
      console.error("Error getting tasks:", error);
      setTasks([]);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Please login to continue");
      } else {
        toast.error("Failed to fetch tasks. Please try again.");
      }
    }
    setLoading(false);
  };

  // get task
  const getTask = async (taskId: string) => {
    if (!taskId) return;
    setLoading(true);
    try {
      const response = await api.get(`/task/${taskId}`);
      if (response.data) {
        setTask(response.data);
      } else {
        toast.error("Task not found");
      }
    } catch (error: unknown) {
      console.error("Error getting task:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Task not found");
        } else {
          toast.error("Failed to fetch task details");
        }
      }
    }
    setLoading(false);
  };

  const createTask = async (taskData: Task) => {
    if (!taskData.title || !taskData.description) {
      toast.error("Title and description are required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/task/create', taskData);
      if (res.data) {
        setTasks(prevTasks => [...prevTasks, res.data]);
        toast.success("Task created successfully");
        closeModal();
      }
    } catch (error: unknown) {
      console.error("Error creating task:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please login to create tasks");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to create task");
        }
      }
    }
    setLoading(false);
  };

  const updateTask = async (taskData: Task) => {
    if (!taskData._id || !taskData.title || !taskData.description) {
      toast.error("Invalid task data");
      return;
    }
    setLoading(true);
    try {
      const res = await api.patch(`/task/${taskData._id}`, taskData);
      if (res.data) {
        setTasks(prevTasks => 
          prevTasks.map(tsk => tsk._id === res.data._id ? res.data : tsk)
        );
        toast.success("Task updated successfully");
        closeModal();
      }
    } catch (error: unknown) {
      console.error("Error updating task:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please login to update tasks");
        } else if (error.response?.status === 404) {
          toast.error("Task not found");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to update task");
        }
      }
    }
    setLoading(false);
  };

  const deleteTask = async (taskId: string) => {
    if (!taskId) {
      toast.error("Invalid task ID");
      return;
    }
    setLoading(true);
    try {
      await api.delete(`/task/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(tsk => tsk._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting task:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please login to delete tasks");
        } else if (error.response?.status === 404) {
          toast.error("Task not found");
          // Remove from local state if task doesn't exist on server
          setTasks(prevTasks => prevTasks.filter(tsk => tsk._id !== taskId));
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to delete task");
        }
      }
    }
    setLoading(false);
  };

  type InputName = keyof Task | 'setTask';
type InputEvent = string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | Task;

const handleInput = (name: InputName) => (e: InputEvent) => {
    if (name === "setTask" && typeof e === 'object' && !('target' in e)) {
      setTask(e as Task);
    } else if (typeof e === 'string') {
      setTask({ ...task, [name]: e });
    } else if ('target' in e) {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  // get completed tasks
  const completedTasks = tasks.filter((task: Task) => task.completed);

  // get pending tasks
  const activeTasks = tasks.filter((task: Task) => !task.completed);

  useEffect(() => {
    getTasks();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setTask({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
        completed: false
      });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setTask({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
        completed: false
      });
    }
  }, [userId]);

  console.log("Active tasks", activeTasks);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        profileModal,
        activeTasks,
        completedTasks
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
