"use client";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import useGetColors from "../hooks/useGetColors";
import { useEffect, useState } from "react";
import { transformMonthIntToName } from "../utils/handleDates";
import { useSocket } from "../context/SocketContext";

interface HighLowData {
  month: number;
  total_high: number;
  total_low: number;
}

interface HighLowResponse {
  value: HighLowData[];
}

interface MetricData {
  month: string;
  value: number;
}

type TransformedHighLow = {
  high: MetricData[];
  low: MetricData[];
};

const transformData = (data: HighLowResponse) => {
  let result: TransformedHighLow = {
    high: [],
    low: [],
  };
  data.value
    .sort((a, b) => (a.month as number) - (b.month as number))
    .forEach((elt) => {
      let monthStr = transformMonthIntToName(elt.month);
      result.high.push({ month: monthStr, value: +elt.total_high.toFixed(2) });
      result.low.push({ month: monthStr, value: +elt.total_low.toFixed(2) });
    });
  return result;
};
const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
export default function HighLowChart() {
  const { colors } = useGetColors("pie-1", "pie-2");
  const dataId = "high_low_per_month";
  const [data, setData] = useState<TransformedHighLow | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${backendUrl}/stock_analysis/${dataId}`);
      if (response.ok) {
        const result = await response.json();
        if (result && result) {
          setData(transformData(result));
        }
      }
    })();
  });
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        {data && data.high && (
          <Pie
            data={data.high}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill={colors["pie-1"]}
          />
        )}
        <Tooltip />
        {data && data.low && (
          <Pie
            data={data.low}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill={colors["pie-2"]}
            label
          />
        )}
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
