"use client";
import { ReactNode, createContext, useContext } from "react";

type EventCallback = (data: any) => void;

interface EventContextType {
  emit: (eventName: string, data: any) => void;
  subscribe: (eventName: string, callback: EventCallback) => void;
}

const EventContext = createContext<EventContextType | null>(null);

export default function EventProvider({ children }: { children: ReactNode }) {
  const events: { [eventName: string]: EventCallback[] } = {};
  const subscribe = (eventName: string, callback: EventCallback) => {
    if (!events[eventName]) {
      events[eventName] = [];
    }
    events[eventName].push(callback);
  };

  const emit = (eventName: string, data: any) => {
    if (events[eventName]) {
      events[eventName].forEach((callback) => callback(data));
    }
  };
  const value = {
    emit,
    subscribe,
  };
  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export function useEventEmitter() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventEmitter must be used within an EventProvider");
  }
  return context;
}
