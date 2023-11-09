import { BsFillDatabaseFill, BsBarChartLineFill } from "react-icons/bs";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
export const metrics = {
  average_volume: {
    Icon: <BsBarChartLineFill />,
    label: "Average Volume",
    value: 0,
  },
  nb_of_entries: {
    Icon: <BsFillDatabaseFill />,
    label: "Number of Entries",
    value: 0,
  },
  highest_high: {
    Icon: <FaArrowUpShortWide />,
    label: "Highest High",
    value: 0,
  },
  lowest_low: {
    Icon: <FaArrowDownShortWide />,
    label: "Lowest Low",
    value: 0,
  },
};
