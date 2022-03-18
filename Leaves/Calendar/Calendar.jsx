/* eslint-disable react-hooks/exhaustive-deps */
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { getAllEvents } from "Api/Leaves";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { dateFormat } from "utils/dateFormat";
import showNotification from "utils/showNotification";
import classes from "./Calendar.module.css";

const Calendar = () => {
  const history = useHistory();
  const handleOnClick = (event) => {
    const [titleType] = event.title.split(":");
    if (titleType.includes("HOLIDAY") || titleType.includes("OPTIONAL DAY"))
      return;
    const start = event.startStr.substr(0, 10),
      end = new Date(event.endStr);
    const queryParams = new URLSearchParams({
      status_type: titleType,
      start,
      end: end?.toJSON()?.substr(0, 10),
    });
    history.push({
      pathname: "/leaves",
      hash: "all",
      search: queryParams.toString(),
    });
  };
  //LOADER
  const [loader, setloader] = useState(false);

  // State for data
  const [events, setEvents] = useState([]);
  // CALENDAR TAB
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAllEvents = async () => {
    if (!startDate || !endDate) return;
    setloader(true);
    try {
      const response = await getAllEvents(startDate, endDate);
      setEvents(response.data);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setloader(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [startDate, endDate, history]);

  function renderEventContent(eventInfo) {
    const [titleType, title] = eventInfo.event.title.split(":");
    return (
      <div
        className={classes.eventDisplay}
        style={{ backgroundColor: eventInfo.event.backgroundColor }}
        onClick={() => handleOnClick(eventInfo.event)}
      >
        <b>{titleType}</b>
        <i>{title}</i>
      </div>
    );
  }
  return (
    <>
      {loader > 0 && (
        <div className="position-fixed w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      )}
      <div className={classes.Calendar}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          headerToolbar={{
            start: "dayGridMonth,dayGridWeek,dayGridDay",
            end: "today prev,next",
            center: "title",
          }}
          datesSet={(dateInfo) => {
            setStartDate(dateFormat("-", dateInfo.start));
            setEndDate(dateFormat("-", dateInfo.end));
          }}
        />
      </div>
    </>
  );
};

export default Calendar;
