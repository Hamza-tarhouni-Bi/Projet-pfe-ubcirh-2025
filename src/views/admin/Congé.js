import React from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css';


// Localizer setup for dayjs
const localizer = dayjsLocalizer(dayjs)

// Example events (replace this with your own events data)
const myEventsList = [
  {
    title: 'Holiday',
    start: new Date(2025, 2, 15), // March 15, 2025
    end: new Date(2025, 2, 15),
  },
  {
    title: 'Leave',
    start: new Date(2025, 2, 20),
    end: new Date(2025, 2, 22),
  },
]

export default function Congé() {
  return (
    <div>
      <h1>Congé</h1>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  )
}
