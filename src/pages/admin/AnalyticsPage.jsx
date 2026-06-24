import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import Navbar from '../../components/Navbar';
import { useBookingsOverTime, useMostBookedHotels, useTotalUsers, useTotalBookings, useOccupancyPerHotel } from '../../hooks/analyticsHooks';

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

const CHART_COLORS = {
  primary: '#1A1A1A',
  secondary: '#333333',
  muted: '#666666',
  light: '#999999',
  surface: '#E8E8E3',
  background: '#F5F5F0',
};

const AnalyticsPage = () => {
  const { data: bookingsOverTime, isLoading: loadingBot, isError: errorBot } = useBookingsOverTime();
  const { data: mostBookedHotels, isLoading: loadingMbh, isError: errorMbh } = useMostBookedHotels();
  const { data: totalUsers, isLoading: loadingTu, isError: errorTu } = useTotalUsers();
  const { data: totalBookings, isLoading: loadingTb, isError: errorTb } = useTotalBookings();
  const { data: occupancyPerHotel, isLoading: loadingOph, isError: errorOph } = useOccupancyPerHotel();

  if (loadingBot || loadingMbh || loadingTu || loadingTb || loadingOph) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Loading...</p>
    </div>
  );
  if (errorBot || errorMbh || errorTu || errorTb || errorOph) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Error loading analytics data.</p>
    </div>
  );

  const bookingsOverTimeData = {
    labels: bookingsOverTime?.map(data => data.date) || [],
    datasets: [
      {
        label: 'Bookings',
        data: bookingsOverTime?.map(data => data.count) || [],
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.surface,
        tension: 0.1,
      },
    ],
  };

  const mostBookedHotelsData = {
    labels: mostBookedHotels?.map(data => data.hotelName) || [],
    datasets: [
      {
        label: 'Number of Bookings',
        data: mostBookedHotels?.map(data => data.count) || [],
        backgroundColor: CHART_COLORS.muted,
      },
    ],
  };

  const occupancyPerHotelData = {
    labels: occupancyPerHotel?.map(data => data.hotelName) || [],
    datasets: [
      {
        label: '% Occupancy',
        data: occupancyPerHotel?.map(data => data.occupancy) || [],
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.muted,
          CHART_COLORS.light,
          CHART_COLORS.surface,
          CHART_COLORS.background,
        ],
        borderColor: CHART_COLORS.background,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: CHART_COLORS.muted,
          font: { family: 'Inter, system-ui, sans-serif' },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: CHART_COLORS.light },
        grid: { color: CHART_COLORS.background },
      },
      y: {
        ticks: { color: CHART_COLORS.light },
        grid: { color: CHART_COLORS.background },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: CHART_COLORS.muted,
          font: { family: 'Inter, system-ui, sans-serif' },
          padding: 16,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink">Analytics</h1>
        <div className="w-12 h-px bg-ink-200 mt-4 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-paper p-8 text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-ink-300">Total Users</p>
            <p className="text-4xl font-light text-ink mt-3">{totalUsers}</p>
          </div>
          <div className="bg-paper p-8 text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-ink-300">Total Bookings</p>
            <p className="text-4xl font-light text-ink mt-3">{totalBookings}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-paper p-8">
            <h2 className="text-xs tracking-[0.25em] uppercase text-ink-300 mb-6">Bookings Over Time</h2>
            <Line data={bookingsOverTimeData} options={chartOptions} />
          </div>
          <div className="bg-paper p-8">
            <h2 className="text-xs tracking-[0.25em] uppercase text-ink-300 mb-6">Most Booked Hotels</h2>
            <Bar data={mostBookedHotelsData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-paper p-8 max-w-lg mx-auto">
          <h2 className="text-xs tracking-[0.25em] uppercase text-ink-300 mb-6 text-center">Occupancy Per Hotel</h2>
          <Pie data={occupancyPerHotelData} options={pieChartOptions} />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
