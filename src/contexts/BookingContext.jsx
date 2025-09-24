import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useLocalStorage("bookings", []);

  const addBooking = (booking) => setBookings([...bookings, booking]);
  const cancelBooking = (id) =>
    setBookings(bookings.filter((b) => b.id !== id));

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingContext);
}
