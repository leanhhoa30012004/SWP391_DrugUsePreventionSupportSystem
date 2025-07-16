import React, { createContext, useContext } from "react";
import useNotification from "../hooks/useNotification";

const NotificationContext = createContext();

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({ userID, children }) => {
  const notification = useNotification(userID);
  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};