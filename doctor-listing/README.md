# Doctor Listing Page

A React application that displays a list of doctors with filtering and search capabilities.

## Features

- Autocomplete search bar for doctor names
- Filter panel with:
  - Consultation type (Video Consult/In Clinic)
  - Specialties (multi-select)
  - Sort options (fees and experience)
- URL-based state management for filters
- Responsive design
- Client-side filtering and sorting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `src/components/DoctorListing.tsx` - Main component with all functionality
- `src/types/doctor.ts` - TypeScript interfaces and types
- `src/App.tsx` - Application root component
- `src/main.tsx` - Application entry point

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Vite

## Testing

The application includes data-testid attributes for automated testing:

- `autocomplete-input` - Search input field
- `suggestion-item` - Autocomplete suggestions
- `doctor-card` - Doctor card container
- `doctor-name` - Doctor's name
- `doctor-specialty` - Doctor's specialty
- `doctor-experience` - Doctor's experience
- `doctor-fee` - Doctor's fee
- Various filter-related test IDs for consultation mode, specialties, and sorting

## API Integration

The application fetches doctor data from:
`https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json`
