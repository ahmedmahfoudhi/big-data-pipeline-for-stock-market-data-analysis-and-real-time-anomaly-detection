"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

type PredictionResponse = {
  _id: string;
  date: string;
  high: number;
  open: number;
  low: number;
  close: number;
  adj_close: number;
  volume: number;
  is_anomaly: boolean;
  created_at: Date;
};

type PredictionData = {
  id: string;
  date: string;
  high: number;
  open: number;
  volume: number;
  label: string;
  isAnomaly: boolean;
  isNew: boolean;
};

const transformEntry = (elt: PredictionResponse, isNew = false) => ({
  id: elt._id,
  date: elt.date,
  isAnomaly: elt.is_anomaly,
  label: elt.is_anomaly ? "Anomaly" : "Not Anomaly",
  open: elt.open,
  volume: elt.volume,
  high: elt.high,
  isNew,
});

const transformData = (data: PredictionResponse[]) =>
  data.map((elt) => transformEntry(elt));

export default function LatestPredictions() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  const [data, setData] = useState<PredictionData[]>([]);
  const newData = useSocket<PredictionResponse, PredictionData | null>(
    "prediction",
    (data) => {
      let transformedData = transformEntry(data, true);
      return transformedData;
    }
  );
  useEffect(() => {
    (async () => {
      const response = await fetch(`${backendUrl}/stock_prediction`);
      if (response.ok) {
        const result = await response.json();
        if (result && result) {
          setData(transformData(result));
        }
      }
    })();
  }, []);
  useEffect(() => {
    console.log(newData);
    if (newData) {
      setData((oldData) => [newData, ...oldData]);
    }
  }, [newData]);

  return (
    <div className="mt-10">
      <h3 className="font-bold text-2xl">Latest Predictions</h3>

      <div className="w-full overflow-x-auto mt-7">
        <table className="min-w-full divide-y divide-gray-200 bg-table-bkg">
          <thead className="bg-table-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs leading-4 font-mediumuppercase uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                High
              </th>
              <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                Open
              </th>
              <th className="px-6 py-3 50 text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                Label
              </th>
            </tr>
          </thead>
          <tbody className="bg-card-bkg divide-y divide-gray-200">
            {data &&
              data.map((elt, index) => (
                <tr
                  key={elt.id}
                  className={`${
                    elt.isNew && !index
                      ? "animate-[bounce_1s_ease-in-out_10]"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-no-wrap">{elt.date}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{elt.volume}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{elt.high}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{elt.open}</td>
                  <td
                    className={`px-6 py-4 whitespace-no-wrap ${
                      elt.isAnomaly ? "text-anomaly-color" : ""
                    }`}
                  >
                    {elt.label}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
