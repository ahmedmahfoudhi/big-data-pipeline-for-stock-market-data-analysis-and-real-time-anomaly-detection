import Image from "next/image";
import Header from "./sections/Header";
import Metrics from "./sections/Metrics";
import Visualizations from "./sections/Visualizations";
import LatestPredictions from "./sections/LatestPredictions";
import Footer from "./sections/Footer";
import EventProvider from "./context/EventContext";
import SocketProvider from "./context/SocketContext";

export default function Home() {
  return (
    <EventProvider>
      <main className="text-color-content">
        <div className="px-10 md:px-30 lg:px-42 xl:px-52">
          <Header />
          <SocketProvider>
            <Metrics />
            <Visualizations />
            <LatestPredictions />
          </SocketProvider>
        </div>
        <Footer />
      </main>
    </EventProvider>
  );
}
