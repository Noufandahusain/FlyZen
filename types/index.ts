// Flight-related types
export interface Flight {
  id: number;
  flight_code: string;
  airline_name: string;
  origin_city: string;
  destination_city: string;
  departure_datetime: string;
  arrival_datetime: string;
  price: number;
  available_seats: number;
}

export interface FlightSearchParams {
  origin_city: string;
  destination_city: string;
  departure_date: string;
  num_passengers?: number;
}

// Booking-related types
export interface BookingRequest {
  flight_id: string;
  num_seats: number;
  user_email?: string;
  passenger_details?: PassengerDetail[];
}

export interface PassengerDetail {
  name: string;
  seat_preference?: string;
}

export interface BookingSummary {
  booking_id: string;
  status: string;
  flight: {
    id: string;
    name: string;
    departure_time: string;
    arrival_time: string;
    origin: string;
    destination: string;
  };
  total_price: number;
  flight_code?: string;
  user_email?: string;
}

export interface BookingDetail {
  booking_id: string;
  user_id: string;
  flight_details: Flight;
  num_tickets: number;
  total_price: number;
  status: string;
  passenger_details?: PassengerDetail[];
  created_at: string;
  updated_at: string;
}

export interface UpdateBookingRequest {
  num_tickets?: number;
  passenger_details?: PassengerDetail[];
  status?: string;
}