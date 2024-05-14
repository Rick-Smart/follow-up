import React from "react";

import {
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Header } from "../components";

// dummy data for testing purposes
import { scheduleData } from "../data/dummy";

const Calendar = () => {
  const onPopupOpen = (args) => {
    args.duration = 4320;
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Apps" title="Calendar" />
      <ScheduleComponent
        popupOpen={onPopupOpen}
        height="650px"
        eventSettings={{ dataSource: scheduleData }}
      >
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </div>
  );
};

export default Calendar;
