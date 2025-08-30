import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { upsertLive, removeLive } from '../features/locationSlice';
import { io } from 'socket.io-client';
import { API_BASE } from '../api';

 
let socket;

export default function MapView() {
  const mapRef = useRef(null);
  const markersRef = useRef({});  
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.user);
  const live = useSelector((s) => s.locations.live);
 
  useEffect(() => {
    const map = L.map('map').setView([20, 77], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    mapRef.current = map;
    return () => map.remove();
  }, []);
 
  useEffect(() => {
    if (!token) return;
    socket = io(API_BASE, { auth: { token } });

    socket.on('recievelocation', (payload) => {
   
      dispatch(upsertLive(payload));
      const { userId, latitude, longitude } = payload;
 
      const map = mapRef.current;
      if (!map) return;
    if (markersRef.current[userId]) {
  markersRef.current[userId].setLatLng([latitude, longitude]);
} else {
  const marker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(userId === user?.id ? "You" : payload.name || userId);  
  markersRef.current[userId] = marker;
}

    });

    socket.on('userdisconnected', (userId) => {
      dispatch(removeLive(userId));
      const marker = markersRef.current[userId];
      if (marker) {
        mapRef.current.removeLayer(marker);
        delete markersRef.current[userId];
      }
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token, dispatch]);

 
  useEffect(() => {
    if (!token || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, heading } = pos.coords;
        
        socket?.emit('sendlocation', { latitude, longitude, speed, heading });
      },
      (err) => console.warn('Geo error', err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [token]);
 
  useEffect(() => {
    if (!user || !mapRef.current) return;
    const mine = live[user?.id];
    if (mine) {
      mapRef.current.setView([mine.latitude, mine.longitude], 14);
    }
  }, [live, user]);

  return <div id="map" className="w-full h-[500px] rounded-lg shadow" />;

}
