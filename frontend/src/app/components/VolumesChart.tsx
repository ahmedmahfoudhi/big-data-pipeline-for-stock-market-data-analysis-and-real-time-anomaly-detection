"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useGetColors from "../hooks/useGetColors";
import { useContext, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { transformMonthIntToName } from "../utils/handleDates";

interface VolumesDataResponse {
  value: VolumesData[];
}

interface VolumesData {
  month: number;
  total_volume: number;
}
type TransformedVolumesData = {
  month: string;
  total_volume: number;
}[];

const transformData = (data: VolumesDataResponse) =>
  data.value
    .sort((a, b) => a.month - b.month)
    .map((elt) => ({
      ...elt,
      month: transformMonthIntToName(elt.month),
    }));

const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
export default function VolumesChart() {
  const { colors } = useGetColors("bar-color");
  const [data, setData] = useState<TransformedVolumesData>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${backendUrl}/stock_analysis/volume_per_month`
      );
      if (response.ok) {
        const result = await response.json();
        if (result && result) {
          setData(transformData(result));
        }
      }
    })();
  }, []);

  return (
    <div className="h-[350px] mt-7">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          {colors && (
            <Bar
              dataKey="total_volume"
              fill={colors["bar-color"]}
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
