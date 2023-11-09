import { useEffect } from "react";
import HighLowChart from "../components/HighLowChart";
import OpenCloseGraph from "../components/OpenCloseGraph";
import VolumesChart from "../components/VolumesChart";

export default function Visualizations() {
  return (
    <div className="mt-10 grid lg:grid-cols-3">
      <div className="col-span-3 lg:col-span-2 h-[400px]">
        <h2 className="text-2xl font-bold">Volumes Per Month</h2>
        <VolumesChart />
      </div>
      <div className="h-[400px]">
        <h2 className="text-2xl font-bold">High / Low</h2>
        <HighLowChart />
      </div>
      <div className="col-span-3">
        <h2 className="text-2xl font-bold">Open / Close</h2>
        <OpenCloseGraph />
      </div>
    </div>
  );
}
