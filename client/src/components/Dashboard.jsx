import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyHistory, fetchUserHistory, clearHistory } from '../features/locationSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.user);
  const { live, history, status } = useSelector((s) => s.locations);

  const handleMyHistory = () => {
    if (!token) return;
    dispatch(fetchMyHistory({ token, limit: 200 }));
  };

  const handleUserHistory = (userId) => {
    dispatch(fetchUserHistory({ userId, limit: 200 }));
  };
  const handleClearHistory = async () => {
  try {
    await fetch("/api/history/clear", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  
      },
    });
    dispatch(clearHistory()); 
  } catch (err) {
    console.error("Error clearing history", err);
  }
};


  const liveList = Object.entries(live); // [ [userId, {lat,lng,updatedAt}], ... ]

  return (
    <div className="p-6 space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleMyHistory}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
        >
          Load My History
        </button>
       <button
  onClick={handleClearHistory}
  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
>
  Clear History
</button>

      </div>

      {/* Live Devices */}
      <div className="bg-white rounded-xl shadow-md border">
        <div className="px-5 py-3 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            Live Devices
          </h3>
        </div>
        <ul className="p-4 space-y-3 text-sm">
          {liveList.length === 0 && (
            <li className="text-gray-500 italic">No active devices</li>
          )}
          {liveList.map(([uid, v]) => (
            <li
              key={uid}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
            >
              {/* Device ID / Name */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">
                  {uid === user?.id ? 'You' : v.name || `Device ${uid}`}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(v.updatedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Coordinates + History Button */}
              <div className="flex flex-wrap items-center gap-3 mt-1 sm:mt-0">
                <span className="text-gray-700">
                  {v.latitude.toFixed(5)}, {v.longitude.toFixed(5)}
                </span>
                <button
                  onClick={() => handleUserHistory(uid)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  History
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* History Logs */}
      <div className="bg-white rounded-xl shadow-md border">
        <div className="px-5 py-3 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-lg text-gray-800">
            History Logs <span className="text-gray-500">({history.length})</span>
          </h3>
        </div>
        <div className="max-h-56 overflow-auto text-sm p-4 space-y-2">
          {status === 'loading' && <div className="text-gray-500">Loading…</div>}
          {history.map((h, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-gray-700">
                  {new Date(h.timestamp || h.createdAt).toLocaleString()}
                </span>
                <span className="text-gray-900 font-medium">
                  {h.latitude.toFixed(5)}, {h.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
