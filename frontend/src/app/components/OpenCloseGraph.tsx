"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useGetColors from "../hooks/useGetColors";
import { transformMonthIntToName } from "../utils/handleDates";
import { useContext, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

interface OpenCloseResonse {
  value: OpenCloseData[];
}

interface OpenCloseData {
  month: number | string;
  total_open: number;
  total_close: number;
}

type OpenCloseTransformed = OpenCloseData[];

const transformData = (data: OpenCloseResonse) =>
  data.value
    .sort((a, b) => (a.month as number) - (b.month as number))
    .map((elt) => ({
      ...elt,
      total_open: elt.total_close - 500,
      month: transformMonthIntToName(elt.month as number),
    }));

const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

export default function OpenCloseGraph() {
  const { colors } = useGetColors("graph-line-1", "graph-line-2");
  const dataId = "open_close_per_month";
  const [data, setData] = useState<OpenCloseTransformed>([]);

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
    <div className="h-[350px] mt-7 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_open"
            stroke={colors["bar-color"]}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="total_close"
            stroke={colors["graph-line-2"]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
