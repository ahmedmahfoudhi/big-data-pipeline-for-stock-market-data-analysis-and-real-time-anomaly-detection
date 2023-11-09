import { useEffect, useState } from "react";
import { useEventEmitter } from "../context/EventContext";

function useGetColors(...colorsNames: string[]) {
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  const { subscribe } = useEventEmitter();
  const getColorValues = () => {
    const colorValues: Record<string, string> = {};
    for (const colorVariable of colorsNames) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        `--${colorVariable}`
      );
      colorValues[colorVariable] = value.trim();
    }
    return colorValues;
  };
  useEffect(() => {
    subscribe("themechange", () => {
      setColors(getColorValues());
    });
    setColors(getColorValues());
  }, []);

  return { colors };
}

export default useGetColors;
