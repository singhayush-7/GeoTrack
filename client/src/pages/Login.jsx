import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register as reg } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { status, error } = useSelector((s) => s.user);
  const [mode, setMode] = useState('login'); 
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await dispatch(login({ email: form.email, password: form.password })).unwrap();
      } else {
        await dispatch(
          reg({ name: form.name, email: form.email, password: form.password })
        ).unwrap();
      }
      nav('/');
    } catch (_) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-5 border"
      >
 
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">📍GeoTrack</h1>
          <p className="text-sm text-gray-500">
            {mode === 'login' ? 'Sign in to track your devices' : 'Create your account'}
          </p>
        </div>

    
        <div className="space-y-3">
          {mode === 'register' && (
            <input
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}

          <input
            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

       
        <button
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading'
            ? 'Please wait…'
            : mode === 'login'
            ? 'Log In'
            : 'Register'}
        </button>

  
        {error && (
          <div className="text-red-600 text-sm text-center">{String(error)}</div>
        )}

     
        <div className="text-sm text-center text-gray-600">
          {mode === 'login' ? (
            <span>
              No account?{' '}
              <button
                type="button"
                className="text-blue-600 font-medium hover:underline"
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Have an account?{' '}
              <button
                type="button"
                className="text-blue-600 font-medium hover:underline"
                onClick={() => setMode('login')}
              >
                Log in
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
