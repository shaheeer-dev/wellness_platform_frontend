# Wellness Platform Frontend

A React TypeScript application for managing wellness clinic clients and appointments.

## Features

### Core Requirements (Take-Home Assignment)
- **Client Management**: Display list of clients with name, email, and phone number
- **Appointments Display**: Show upcoming appointments with filtering capabilities
- **Schedule Appointments**: Form to create new appointments for clients
- **Search/Filter**: Search clients by name, email, or phone; filter appointments by status

### Additional Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Automatic refresh after creating/updating appointments
- **Status Management**: Mark appointments as completed or cancel them
- **Data Sync**: Sync data with external API via the Rails backend
- **Modern UI**: Clean, professional design with smooth animations

## Technology Stack

- **React 18** with TypeScript
- **Axios** for API communication
- **date-fns** for date formatting and manipulation
- **CSS3** with modern features (Grid, Flexbox, Animations)

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Rails backend running on `http://localhost:3000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
src/
├── components/           # React components
│   ├── ClientList.tsx   # Client listing with search
│   ├── AppointmentsList.tsx  # Appointments with filtering
│   └── AppointmentForm.tsx   # New appointment form
├── services/            # API communication
│   └── api.ts          # Axios service for Rails backend
├── types/              # TypeScript type definitions
│   └── index.ts        # API response types
└── App.tsx             # Main application component
```

## API Integration

The frontend communicates with the Rails backend API:

- `GET /api/v1/clients` - Fetch clients with search
- `GET /api/v1/appointments` - Fetch appointments with filters
- `POST /api/v1/clients/:id/appointments` - Create new appointments
- `PATCH /api/v1/appointments/:id` - Update appointment status
- `DELETE /api/v1/appointments/:id` - Cancel appointments
- `POST /api/v1/sync` - Trigger data sync with external API

## Key Components

### ClientList
- Displays paginated list of clients
- Real-time search functionality
- Client selection for appointment filtering
- Responsive card layout

### AppointmentsList
- Shows appointments with status indicators
- Filter by status (all, upcoming, scheduled, completed, cancelled)
- Client-specific filtering when a client is selected
- Action buttons for completing/cancelling appointments

### AppointmentForm
- Modal form for scheduling new appointments
- Client selection or pre-selected client
- Date/time picker with validation
- Appointment type selection
- Optional notes field

## UI/UX Features

- **Color-coded Status**: Visual indicators for appointment statuses
- **Smooth Animations**: Hover effects and transitions
- **Mobile-first Design**: Responsive layout for all screen sizes
- **Loading States**: Proper feedback during API calls
- **Error Handling**: User-friendly error messages with retry options
- **Accessibility**: Semantic HTML and keyboard navigation

## Development Notes

- Clean, maintainable React/TypeScript code
- Modern CSS techniques and responsive design
- API integration with proper error handling
- Component architecture and state management
- User experience best practices
