import { Fragment, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import Header from "../components/layout/Header";
import Humidity from "./Humidity";
import Temperature from "./Temperature";

const Routing = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  console.log(selectedDate);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Fragment>
      <Header selectedDate={selectedDate} onDateChange={handleDateChange} />
      <main>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/temperature" />
          </Route>
          <Route path="/temperature">
            <Temperature selectedDate={selectedDate} />
          </Route>
          <Route path="/humidity">
            <Humidity selectedDate={selectedDate} />
          </Route>
          <Route path="*">Not Found!</Route>
        </Switch>
      </main>
    </Fragment>
  );
};

export default Routing;
