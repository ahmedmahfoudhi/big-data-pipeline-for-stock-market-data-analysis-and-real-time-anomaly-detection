"use client";
import { useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { useEventEmitter } from "../context/EventContext";
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(1);
  const { emit } = useEventEmitter();

  const switchTheme = () => {
    setTheme((old) => 1 - old);
    document.documentElement.setAttribute(
      "theme",
      theme === 1 ? "dark" : "light"
    );
    emit("themechange", null);
  };
  return (
    <div
      onClick={switchTheme}
      className="text-3xl cursor-pointer fixed right-10 lg:top-5"
    >
      {theme === 1 ? <BsMoon /> : <BsSun />}
    </div>
  );
}
