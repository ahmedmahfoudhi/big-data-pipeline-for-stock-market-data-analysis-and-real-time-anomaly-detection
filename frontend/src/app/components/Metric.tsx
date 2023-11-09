import { IconType } from "react-icons";

export interface MetricProps {
  Icon: JSX.Element;
  label: string;
  value: number;
}
export default function Metric({ Icon, label, value }: MetricProps) {
  return (
    <div className="flex p-4 bg-card-bkg rounded-xl justify-between shadow-xl h-[100px]">
      <div className="flex justify-between flex-col">
        <h3>{label}</h3>
        <p>{value.toFixed(2)}</p>
      </div>
      <div className="self-center text-2xl">{Icon}</div>
    </div>
  );
}
