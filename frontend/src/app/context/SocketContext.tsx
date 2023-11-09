"use client";
import {
  Context,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

type DataTransformer<T, U> = (data: T) => U;
export interface SocketContextType<T, U> {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType<unknown, unknown> | null>(
  null
);

const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) setSocket(io(backendUrl));
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket<T, U>(
  dataId: string,
  transformer: DataTransformer<T, U> = (data: T) => data as unknown as U
) {
  const socket = useContext(
    SocketContext as Context<SocketContextType<T, U>>
  ).socket;
  const [data, setData] = useState<U>();
  const context = useContext(SocketContext as Context<SocketContextType<T, U>>);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  useEffect(() => {
    if (socket) {
      socket.on(dataId, (response) => {
        setData(transformer(response));
      });
    }
  }, [socket]);
  return data;
}
