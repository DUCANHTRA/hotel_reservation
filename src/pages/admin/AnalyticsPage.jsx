import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import Navbar from '../../components/Navbar';
import { useBookingsOverTime, useMostBookedHotels, useTotalUsers, useTotalBookings, useOccupancyPerHotel } from '../../hooks/analyticsHooks';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsPage = () => {
  const { data: bookingsOverTime, isLoading: loadingBot, isError: errorBot } = useBookingsOverTime();
  const { data: mostBookedHotels, isLoading: loadingMbh, isError: errorMbh } = useMostBookedHotels();
  const { data: totalUsers, isLoading: loadingTu, isError: errorTu } = useTotalUsers();
  const { data: totalBookings, isLoading: loadingTb, isError: errorTb } = useTotalBookings();
  const { data: occupancyPerHotel, isLoading: loadingOph, isError: errorOph } = useOccupancyPerHotel();

  if (loadingBot || loadingMbh || loadingTu || loadingTb || loadingOph) return <div className="text-center mt-8 text-xl">Loading analytics...</div>;
  if (errorBot || errorMbh || errorTu || errorTb || errorOph) return <div className="text-center mt-8 text-red-500 text-xl">Error loading analytics data.</div>;

  // Data for Bookings Over Time (Line Chart)
  const bookingsOverTimeData = {
    labels: bookingsOverTime?.map(data => data.date) || [],
    datasets: [
      {
        label: 'Bookings',
        data: bookingsOverTime?.map(data => data.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Data for Most Booked Hotels (Bar Chart)
  const mostBookedHotelsData = {
    labels: mostBookedHotels?.map(data => data.hotelName) || [],
    datasets: [
      {
        label: 'Number of Bookings',
        data: mostBookedHotels?.map(data => data.count) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // Data for Occupancy Per Hotel (Pie Chart)
  const occupancyPerHotelData = {
    labels: occupancyPerHotel?.map(data => data.hotelName) || [],
    datasets: [
      {
        label: '% Occupancy',
        data: occupancyPerHotel?.map(data => data.occupancy) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800">Total Users</h2>
            <p className="text-5xl font-bold text-blue-600 mt-4">{totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800">Total Bookings</h2>
            <p className="text-5xl font-bold text-green-600 mt-4">{totalBookings}</p>
          </div>
          {/* Placeholder for other key metrics */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bookings Over Time</h2>
            <Line data={bookingsOverTimeData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Most Booked Hotels</h2>
            <Bar data={mostBookedHotelsData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Occupancy Per Hotel (%)</h2>
          <Pie data={occupancyPerHotelData} />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
