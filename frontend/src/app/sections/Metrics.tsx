"use client";
import { useEffect, useState } from "react";
import Metric from "../components/Metric";
import { metrics as metricsConstants } from "../constants/index";

export default function Metrics() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  const [metricsData, setMetricsData] = useState(metricsConstants);

  useEffect(() => {
    (async () => {
      let hasUpdates = false;
      const updatedMetrics = { ...metricsData };

      for (const key of Object.keys(metricsData)) {
        const response = await fetch(`${backendUrl}/stock_analysis/${key}`);
        if (response.ok) {
          const result = await response.json();
          if (
            result &&
            result.value !== undefined &&
            result.value !== metricsData[key as keyof typeof metricsData].value
          ) {
            updatedMetrics[key as keyof typeof metricsData].value =
              result.value;
            hasUpdates = true;
          }
        }
      }

      if (hasUpdates) {
        setMetricsData(updatedMetrics);
      }
    })();
  }, []);

  return (
    <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-10">
      {Object.keys(metricsData).map((key) => (
        <Metric key={key} {...metricsData[key as keyof typeof metricsData]} />
      ))}
    </div>
  );
}
