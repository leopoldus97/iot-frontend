import { gql, useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import { DataModel } from "../models/DataModel";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

type MeasurementType = "humidity" | "temperature";

const TEMPERATURES_QUERY = gql`
  query GetTemperatures {
    records: temperatures(filter: { sensorId: "FancySensor3000" }) {
      _id
      measurementTime
      value
    }
  }
`;

const HUMIDITY_QUERY = gql`
  query GetHumidity {
    records: humidities(filter: { sensorId: "FancySensor3000" }) {
      _id
      measurementTime
      value
    }
  }
`;

const Temperature = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementType>("temperature");

  const { loading, error, data } =
    useQuery<{ records: DataModel[] }>(selectedMeasurement === "temperature" ? TEMPERATURES_QUERY : HUMIDITY_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chartData = (data: DataModel[]) => {
    return {
      labels: data.map(record => new Date(record.measurementTime).toLocaleTimeString()),
      datasets: [
        {
          label: selectedMeasurement === "temperature" ? "Temperature" : "Humidity",
          data: data.map(temp => temp.value),
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
        }
      ],
    };
  }

  const filterRecords = (record: DataModel) => {
    const date = new Date(record.measurementTime);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return date >= selectedDate && date < nextDay;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <div style={{ margin: "16px 0px", display: "flex", flexDirection: "row" }}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            label="Basic example"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue!)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel id="select-label">Measurement</InputLabel>
          <Select label="Measurement" labelId="select-label" value={selectedMeasurement} onChange={ev => setSelectedMeasurement(ev.target.value as MeasurementType)}>
            <MenuItem value={"humidity"}>Humidity</MenuItem>
            <MenuItem value={"temperature"}>Temperature</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        {data ? <Line style={{ flex: "0 0 20px" }} data={chartData(data.records.filter(filterRecords))} /> : <span>Loading...</span>}
      </div>
    </div>
  );
};

export default Temperature;
