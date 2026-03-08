# VetAdmin

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-fast-purple)
![Supabase](https://img.shields.io/badge/Supabase-backend-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)
![License](https://img.shields.io/badge/license-private-red)

VetAdmin is a veterinary clinic management system built with modern frontend and backend technologies.
The platform allows clinics to manage patients, appointments, veterinary services, and clients through a modern and intuitive interface.

VetAdmin is designed to optimize administrative workflows in veterinary clinics and improve operational efficiency in animal care.

---

## Technologies Used

### Frontend

- React 19
- Vite
- React Router DOM v7
- TanStack Query (React Query)
- Radix UI
- Lucide React
- React Hot Toast
- Modular CSS

### Backend

- Supabase
- PostgreSQL
- Row Level Security (RLS)

---

## Features

- Patient management
- Client management
- Veterinary appointment scheduling
- Administrative dashboard
- Modern and responsive interface
- Efficient server state management with React Query
- Modular and scalable architecture

---

## Test Access

To explore the platform features you can use the following demo credentials.

Email

vettest@mail.com

Password

Hola_123

---

## Installation

### 1. Clone the repository

git clone https://github.com/Ypz22/VetAdmin.git
cd VetAdmin

### 2. Install dependencies

npm install

### 3. Configure environment variables

Create a .env file in the project root.

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

### 4. Run the project

npm run dev

---

## Available Scripts

Run development server

npm run dev

Build production version

npm run build

Preview production build

npm run preview

---

## Project Structure

```
src
 ├── api
 │   └── direct requests to Supabase services
 │
 ├── components
 │   └── reusable UI components
 │
 ├── config
 │   └── service configuration (Supabase client)
 │
 ├── hooks
 │   └── custom React hooks
 │
 ├── pages
 │   └── main application pages
 │
 ├── queries
 │   └── TanStack Query hooks implementation
 │
 ├── styles
 │   └── global and component styles
 │
 └── utils
     └── helper functions and utilities
```
---

## Architecture

VetAdmin follows a modular architecture built with:

React for the user interface  
Supabase as Backend-as-a-Service  
TanStack Query for server state management  
Reusable and decoupled components  

This approach keeps the application scalable and maintainable.

---

## Roadmap

Future improvements planned for the system

Analytics dashboard with metrics  
Notification system  
Complete medical history records  
Veterinary inventory management  
Multi-clinic support

---

## Preview

### Dashboard

![dashboard](public/readme/dashboard.png)

### Patients

![patients](public/readme/patients.png)

---

## Author

Jefferson Yepez  
Software Engineering Student

---

## License

This project is private and not available for public distribution.
