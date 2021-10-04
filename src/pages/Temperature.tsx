import { gql, useQuery } from "@apollo/client";
import { BubbleDataPoint, ChartData, ScatterDataPoint } from "chart.js";
import { Line } from "react-chartjs-2";
import { DataEntry } from "../models/DataEntry";
import { DataModel } from "../models/DataModel";
import { DataSeries } from "../models/DataSeries";

const Temperature = () => {
  const TEMPERATURES_QUERY = gql`
    query GetTemperatures {
      temperatures(filter: { sensorId: "FancySensor3000" }) {
        _id
        measurementTime
        value
      }
    }
  `;

  const { loading, error, data } =
    useQuery<{ temperatures: DataModel[] }>(TEMPERATURES_QUERY);

  const s = data?.temperatures.map((measurements) => {
    const series: DataEntry[] = [];
    const dataSeries: DataSeries = {
      name: "FancySensor3000",
      series: series,
    };
    if (measurements instanceof Array) {
      measurements.forEach((m) => {
        series.push({
          name: m.measurementTime.toString(),
          value: m.value,
        });
      });
    }
    return dataSeries;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chartData: ChartData = {
    datasets: [
      {
        label: "Temperature",
        data: [23, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <div style={{ width: "80%", height: "80%" }}>
      <Line data={[s]} />
    </div>
  );
};

export default Temperature;
