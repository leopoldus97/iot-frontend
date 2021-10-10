import { gql, useQuery, useSubscription } from "@apollo/client";
import { Line } from "react-chartjs-2";
import { DataModel } from "../models/DataModel";
import { FC, useEffect, useState } from "react";

interface FuncProps {
  selectedDate: Date;
}

const HUMIDITY_QUERY = gql`
  query GetHumidity {
    records: humidities(filter: { sensorId: "FancySensor3000" }) {
      _id
      measurementTime
      value
    }
  }
`;

const HUMIDITY_SUBSCRIPTION = gql`
  subscription HumSubscription {
    record: humidityAdded {
      _id
      measurementTime
      value
    }
  }
`;

const Humidity: FC<FuncProps> = (props) => {
  const [dataArr, setDataArr] = useState<DataModel[]>([]);
  const { selectedDate } = props;

  const {
    loading,
    error: queryError,
    data: queryData,
  } = useQuery<{ records: DataModel[] }>(HUMIDITY_QUERY);

  useEffect(() => {
    if (queryData) {
      setDataArr((prevArr) => [...prevArr, ...queryData.records]);
    }
  }, [queryData]);

  const { error: subscriptionError, data: subscriptionData } = useSubscription<{
    record: DataModel;
  }>(HUMIDITY_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData && subscriptionData.record) {
      setDataArr((prevData) => [...prevData, subscriptionData.record]);
    }
  }, [subscriptionData]);

  if (loading) return <p>Loading...</p>;
  if (queryError || subscriptionError)
    return <p>Error: {queryError?.message || subscriptionError?.message}</p>;

  const chartData = (data: DataModel[]) => {
    return {
      labels: data.map((record) =>
        new Date(record.measurementTime).toLocaleTimeString()
      ),
      datasets: [
        {
          label: "Humidity",
          data: data.map((temp) => temp.value),
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };
  };

  const filterRecords = (record: DataModel) => {
    const date = new Date(record.measurementTime);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return date >= selectedDate && date < nextDay;
  };

  return (
    <div>
      <div>
        {dataArr ? (
          <Line
            style={{ flex: "0 0 20px" }}
            data={chartData(dataArr.filter(filterRecords))}
          />
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
};

export default Humidity;
