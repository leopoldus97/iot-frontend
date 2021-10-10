import DateAdapter from "@mui/lab/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useHistory } from "react-router";
import { FC, useState } from "react";

type MeasurementType = "humidity" | "temperature";

interface FuncProps {
  selectedDate: Date;
  onDateChange(date: Date): void;
};

const Header: FC<FuncProps> = (props) => {
  const history = useHistory();
  const { selectedDate, onDateChange } = props;

  const [selectedMeasurement, setSelectedMeasurement] =
    useState<MeasurementType>("temperature");

  const handleMeasurementTypeChange = (type: MeasurementType) => {
    setSelectedMeasurement(type);
    history.push("/" + type);
  };

  return (
    <div style={{ margin: "16px 0px", display: "flex", flexDirection: "row" }}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DatePicker
          label="Basic example"
          value={selectedDate}
          onChange={(newValue) => onDateChange(newValue!)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <FormControl fullWidth>
        <InputLabel id="select-label">Measurement</InputLabel>
        <Select
          label="Measurement"
          labelId="select-label"
          value={selectedMeasurement}
          onChange={(ev) =>
            // setSelectedMeasurement(ev.target.value as MeasurementType)
            handleMeasurementTypeChange(ev.target.value as MeasurementType)
          }
        >
          <MenuItem value={"humidity"}>Humidity</MenuItem>
          <MenuItem value={"temperature"}>Temperature</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Header;
