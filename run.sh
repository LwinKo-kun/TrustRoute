#!/bin/bash

# Navigate to backend and start Laravel server
echo "Starting Laravel backend..."
cd backend
php artisan serve &
BACKEND_PID=$!

# Navigate to frontend and start Vite server
echo "Starting React frontend..."
../frontend
# Wait a moment then go to frontend directory
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "----------------------------------------"
echo " Both servers are running!"
echo " - Backend:  http://127.0.0.1:8000"
echo " - Frontend: Check terminal output above"
echo "----------------------------------------"
echo "Press [CTRL+C] to stop both servers."

# Trap Ctrl+C and kill both background processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Keep script running
wait
