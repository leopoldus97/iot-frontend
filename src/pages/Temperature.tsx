import { gql, useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import { DataModel } from "../models/DataModel";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

type MeasurementType = "humidity" | "temperature";

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

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chartData = (data: DataModel[]) => {
    return {
      labels: data.map(record => new Date(record.measurementTime).toLocaleTimeString()),
      datasets: [
        {
          label: "Temperature",
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
      <div style={{ margin: "16px 0px" }}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            label="Basic example"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue!)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Measurement</InputLabel>
          <Select>
            <MenuItem value={""}>Humidity</MenuItem>
            <MenuItem value={""}>Temperature</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        {data ? <Line style={{ flex: "0 0 20px" }} data={chartData(data.temperatures.filter(filterRecords))} /> : <span>Loading...</span>}
      </div>
    </div>
  );
};

export default Temperature;
