import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

interface User {
  _id?: string;
  name?: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin';
}

interface ApiResponse<T = any> {
  data: T;
  message: string;
}

interface ApiError extends Error {
  response?: {
    data?: {
      message: string;
    };
    status?: number;
  };
}

interface UserContextType {
  user: User;
  allUsers: User[];
  userState: User;
  loading: boolean;
  isAuthenticated: boolean;
  registerUser: (e: React.FormEvent) => Promise<void>;
  loginUser: (e: React.FormEvent) => Promise<void>;
  logoutUser: () => Promise<void>;
  getUser: () => Promise<void>;
  updateUser: (e: React.FormEvent, data: Partial<User>) => Promise<void>;
  emailVerification: () => Promise<void>;
  verifyUser: (token: string) => Promise<void>;
  forgotPasswordEmail: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  handlerUserInput: (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteUser: (id: string) => Promise<void>;
  userLoginStatus: () => Promise<boolean>;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

// set axios to include credentials with every request
axios.defaults.withCredentials = true;

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const serverUrl = "https://taskmanager-v1.onrender.com";

  const router = useRouter();

  const [user, setUser] = useState<User>({} as User);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userState, setUserState] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // register user
  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    try {
      const res = await axios.post<ApiResponse<User>>(`${serverUrl}/api/v1/register`, userState);
      toast.success("User registered successfully");

      setUserState({
        name: "",
        email: "",
        password: "",
      });

      router.push("/login");
    } catch (error: unknown) {
      console.error("Error registering user", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // login the user
  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<ApiResponse<User>>(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true
        }
      );

      toast.success("User logged in successfully");

      setUserState({
        email: "",
        password: "",
      });

      setIsAuthenticated(true);
      await getUser();
      router.push("/");
    } catch (error: unknown) {
      console.error("Error logging in user", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // get user Logged in Status
  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get<ApiResponse<boolean>>(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true
      });

      loggedIn = !!res.data;
      setIsAuthenticated(loggedIn);
      setLoading(false);

      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error("Error getting user login status", error);
      setLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push("/login");
        } else {
          toast.error(error.response?.data?.message || 'An error occurred');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }

    return loggedIn;
  };

  // verify user/email
  const verifyUser = async (token: string) => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>(
        `${serverUrl}/api/v1/verify-user/${token}`,
        {},
        {
          withCredentials: true
        }
      );

      toast.success("User verified successfully");
      await getUser();
      setLoading(false);
      router.push("/");
    } catch (error: unknown) {
      console.error("Error verifying user", error);
      setLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to verify user');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // logout user
  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true, // send cookies to the server
      });

      toast.success("User logged out successfully");

      setUser({
        name: "",
        email: "",
        password: "",
        role: "user"
      });
      setIsAuthenticated(false);

      // redirect to login page
      router.push("/login");
    } catch (error: unknown) {
      console.error("Error logging out user", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to logout');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // get user details
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse<User>>(`${serverUrl}/api/v1/user`, {
        withCredentials: true
      });

      setUser((prevState) => ({
        ...prevState,
        ...res.data
      }));
    } catch (error: unknown) {
      console.error("Error getting user details", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch user details');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // update user details
  const updateUser = async (e: React.FormEvent, data: Partial<User>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch<ApiResponse<User>>(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true
      });

      setUser((prevState) => ({
        ...prevState,
        ...res.data
      }));

      toast.success("User updated successfully");
    } catch (error: unknown) {
      console.error("Error updating user details", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update user');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // email verification
  const emailVerification = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verify-email`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Email verification sent successfully");
      setLoading(false);
    } catch (error: unknown) {
      console.error("Error sending email verification", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to send verification email');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  // forgot password email
  const forgotPasswordEmail = async (email: string) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Forgot password email sent successfully");
      setLoading(false);
    } catch (error: unknown) {
      console.error("Error sending forgot password email", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to send password reset email');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  // reset password
  const resetPassword = async (token: string, password: string) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        {
          password,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password reset successfully");
      setLoading(false);
      // redirect to login page
      router.push("/login");
    } catch (error: unknown) {
      console.error("Error resetting password", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  // change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password changed successfully");
      setLoading(false);
    } catch (error: unknown) {
      console.error("Error changing password", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to change password');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  // admin routes
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<User[]>(`${serverUrl}/api/v1/admin/users`, {
        withCredentials: true, // send cookies to the server
      });

      setAllUsers(res.data);
      setLoading(false);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.log("Error getting all users", apiError);
      toast.error(apiError.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  // dynamic form handler
  const handlerUserInput = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // delete user
  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete<ApiResponse>(
        `${serverUrl}/api/v1/admin/users/${id}`,
        {
          withCredentials: true
        }
      );

      toast.success("User deleted successfully");
      getAllUsers();
    } catch (error: unknown) {
      console.error("Error deleting user", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        isAuthenticated,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
        loading,
        getUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
