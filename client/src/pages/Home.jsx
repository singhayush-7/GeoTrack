import React from 'react';
import MapView from '../components/Mapview';
import Dashboard from '../components/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-gray-900 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold text-lg">GeoTrack</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline text-gray-200">
            {user?.name}
          </span>
          <button
            onClick={() => dispatch(logout())}
            className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 md:p-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-2 bg-gray-100 border-b text-gray-700 font-medium">
            Live Map
          </div>
          <div className="h-[70vh] lg:h-full">
            <MapView />
          </div>
        </div>

        {/* Dashboard Panel */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-2 bg-gray-100 border-b text-gray-700 font-medium">
            Control Panel
          </div>
          <div className="p-4">
            <Dashboard />
          </div>
        </div>
      </main>
    </div>
  );
}
