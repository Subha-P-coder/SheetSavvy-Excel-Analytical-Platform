/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/me`, {
          withCredentials: true,
        });

        if (data.success) {
          setUserData(data.userData);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch user data");
      }
    };

    const getAuthState = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
          withCredentials: true,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getAuthState();
  }, [backendUrl]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    isDarkTheme,
    toggleTheme,
    recordId,
    setRecordId
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
