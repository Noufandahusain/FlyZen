import axios from 'axios';
import { Flight, BookingSummary, BookingDetail, BookingRequest } from '@/types';

// Base URLs for API services
const BASE_CLIENT_URL = 'http://localhost:5000/api';
const BASE_BOOKING_URL = 'http://localhost:5001/v1';

// Create axios instances
const clientApi = axios.create({
  baseURL: BASE_CLIENT_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const bookingApi = axios.create({
  baseURL: BASE_BOOKING_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock API responses for development
const mockFlights: Flight[] = [
  {
    id: 101,
    flight_code: 'GA204',
    airline_name: 'Garuda Indonesia',
    origin_city: 'CGK',
    destination_city: 'DPS',
    departure_datetime: '2025-12-20T08:00:00Z',
    arrival_datetime: '2025-12-20T10:50:00Z',
    price: 1650000,
    available_seats: 35
  },
  {
    id: 102,
    flight_code: 'JT506',
    airline_name: 'Lion Air',
    origin_city: 'CGK',
    destination_city: 'DPS',
    departure_datetime: '2025-12-20T10:30:00Z',
    arrival_datetime: '2025-12-20T13:20:00Z',
    price: 950000,
    available_seats: 5
  },
  {
    id: 103,
    flight_code: 'QZ7510',
    airline_name: 'AirAsia',
    origin_city: 'CGK',
    destination_city: 'DPS',
    departure_datetime: '2025-12-20T14:15:00Z',
    arrival_datetime: '2025-12-20T17:05:00Z',
    price: 850000,
    available_seats: 12
  }
];

const mockBookings: BookingSummary[] = [
  {
    booking_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    flight_code: 'GA204',
    user_id: 'user_test_001',
    status: 'CONFIRMED',
    booking_date: '2025-11-15T10:30:00Z',
    total_price: 1650000,
    origin_city: 'CGK',
    destination_city: 'DPS'
  },
  {
    booking_id: 'b2c3d4e5-f6a1-8901-2345-67890abcdef1',
    flight_code: 'JT506',
    user_id: 'user_test_001',
    status: 'PENDING',
    booking_date: '2025-11-20T14:45:00Z',
    total_price: 950000,
    origin_city: 'DPS',
    destination_city: 'SUB'
  },
  {
    booking_id: 'c3d4e5f6-a1b2-9012-3456-7890abcdef12',
    flight_code: 'QZ7510',
    user_id: 'user_test_001',
    status: 'CANCELLED',
    booking_date: '2025-11-25T09:15:00Z',
    total_price: 850000,
    origin_city: 'SUB',
    destination_city: 'CGK'
  }
];

// API functions

// Flight-related API calls
export const searchFlights = async (params: any): Promise<Flight[]> => {
  try {
    // In a real app, we would make an actual API call:
    // const response = await clientApi.get('/flights', { params });
    // return response.data;
    
    // For demo purposes, return mock data with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockFlights;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// Booking-related API calls
export const createBooking = async (bookingData: BookingRequest): Promise<any> => {
  try {
    // In a real app:
    // const response = await clientApi.post('/bookings', bookingData);
    // return response.data;
    
    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      message: 'Booking created successfully',
      booking_id: 'd4e5f6a1-b2c3-0123-4567-890abcdef123',
      flight_details: mockFlights[0]
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookings = async (userId?: string): Promise<BookingSummary[]> => {
  try {
    // In a real app:
    // const response = await clientApi.get('/bookings', { params: { user_id: userId } });
    // return response.data;
    
    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockBookings.filter(booking => !userId || booking.user_id === userId);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getBookingById = async (bookingId: string): Promise<BookingDetail> => {
  try {
    // In a real app:
    // const response = await clientApi.get(`/bookings/${bookingId}`);
    // return response.data;
    
    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    const booking = mockBookings.find(b => b.booking_id === bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    const flight = mockFlights.find(f => f.flight_code === booking.flight_code) || mockFlights[0];
    
    return {
      booking_id: booking.booking_id,
      user_id: booking.user_id,
      flight_details: flight,
      num_tickets: 2,
      total_price: booking.total_price,
      status: booking.status,
      passenger_details: [
        {
          name: 'John Doe',
          seat_preference: 'Window'
        },
        {
          name: 'Jane Doe',
          seat_preference: 'Aisle'
        }
      ],
      created_at: booking.booking_date,
      updated_at: booking.booking_date
    };
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

export const updateBooking = async (bookingId: string, data: any): Promise<BookingDetail> => {
  try {
    // In a real app:
    // const response = await clientApi.put(`/bookings/${bookingId}`, data);
    // return response.data;
    
    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    const bookingDetail = await getBookingById(bookingId);
    return {
      ...bookingDetail,
      ...data,
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    // In a real app:
    // await clientApi.delete(`/bookings/${bookingId}`);
    
    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    const index = mockBookings.findIndex(b => b.booking_id === bookingId);
    if (index !== -1) {
      mockBookings[index].status = 'CANCELLED';
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};