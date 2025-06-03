import axios from 'axios';
import { Flight, BookingSummary, BookingDetail, BookingRequest, FlightSearchParams } from '@/types';
import { useApi } from '@/context/AuthContext';

// Fungsi untuk membuat axios instance dengan baseUrl dari context
export const createApiInstance = (baseUrl: string) => axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API functions

// Flight-related API calls
export const searchFlights = async (params: FlightSearchParams, baseUrl: string): Promise<Flight[]> => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get('/schedules', { 
      params: {
        origin: params.origin_city,
        destination: params.destination_city,
        date: params.departure_date,
        // Assuming limit and page can still be passed if needed, though not in FlightSearchParams
        // You might want to add them to FlightSearchParams if they are part of search
        // limit: params.limit || 10,
        // page: params.page || 1
      }
    });
    
    // Transform the response to match our frontend interface
    return response.data.flights.map((flight: any) => ({
      id: flight.id,
      flight_code: flight.airline,
      airline_name: flight.airline,
      origin_city: flight.origin,
      destination_city: flight.destination,
      departure_datetime: flight.departure_time,
      arrival_datetime: flight.arrival_time,
      price: flight.price_per_seat,
      available_seats: flight.available_seats
    }));
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// Booking-related API calls
export const createBooking = async (bookingData: BookingRequest, userEmail: string, baseUrl: string): Promise<any> => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post('/bookings', {
      flight_id: bookingData.flight_id,
      user_email: userEmail,
      num_seats: bookingData.num_seats
    }, {
      headers: {
        'x-user-email': userEmail
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookings = async (userEmail?: string, baseUrl?: string): Promise<BookingSummary[]> => {
  const api = createApiInstance(baseUrl || 'http://10.49.66.71:3000');
  try {
    const response = await api.get('/bookings', {
      headers: userEmail ? { 'x-user-email': userEmail } : {},
    });
    return response.data.map((booking: any) => ({
      booking_id: booking.booking_id,
      flight_code: booking.flight.airline,
      user_id: booking.user_email,
      status: booking.status,
      booking_date: booking.payment_due_timestamp,
      total_price: booking.total_price,
      origin_city: booking.flight.origin,
      destination_city: booking.flight.destination
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getBookingById = async (bookingId: string, baseUrl?: string): Promise<BookingDetail> => {
  const api = createApiInstance(baseUrl || 'http://10.49.66.71:3000');
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    const bookingData = response.data;
    
    return {
      booking_id: bookingData.booking_id,
      user_id: bookingData.user_email,
      flight_details: {
        id: bookingData.flight.id,
        flight_code: bookingData.flight.airline,
        airline_name: bookingData.flight.airline,
        origin_city: bookingData.flight.origin,
        destination_city: bookingData.flight.destination,
        departure_datetime: bookingData.flight.departure_time,
        arrival_datetime: bookingData.flight.arrival_time,
        price: bookingData.flight.price_per_seat,
        available_seats: bookingData.flight.available_seats
      },
      num_tickets: bookingData.num_seats,
      total_price: bookingData.total_price,
      status: bookingData.status,
      passenger_details: [], // This would need to be implemented on the backend
      created_at: bookingData.payment_due_timestamp,
      updated_at: bookingData.payment_due_timestamp
    };
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

export const updateBooking = async (bookingId: string, data: any): Promise<BookingDetail> => {
  try {
    // Since the backend doesn't have an update endpoint,
    // we'll just return the current booking details
    return await getBookingById(bookingId);
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    // Since the backend doesn't have a cancel endpoint,
    // we'll just throw an error for now
    throw new Error('Cancel booking not implemented in backend');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};