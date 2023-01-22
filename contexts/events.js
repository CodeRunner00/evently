import { createContext } from "react";

export const EventsContext = createContext({
  events: [],
  setEvents: (events) => {},
});
