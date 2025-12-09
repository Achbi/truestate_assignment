# TruEstate - Retail Sales Management System

## Overview

TruEstate is a modern retail sales management system designed to handle large-scale transaction data (830K+ records) with advanced search, filtering, sorting, and pagination capabilities. The application provides a comprehensive dashboard for analyzing sales data, tracking customer transactions, and generating insights through interactive visualizations. Built with a React frontend and Node.js/Express backend, it offers real-time data manipulation while maintaining optimal performance through efficient query building and caching strategies.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Tailwind CSS, TanStack Query (React Query), Recharts, Vite, React Router |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **State Management** | TanStack Query for server state, React Context for theme/toast |
| **Build Tools** | Vite (Frontend), Node.js (Backend) |

## Search Implementation Summary

The search functionality implements full-text search across multiple fields using MongoDB regex queries:

- **Search Fields**: Customer Name, Phone Number, Product Name, and Customer ID
- **Implementation**: Case-insensitive regex matching using MongoDB `$or` operator
- **Performance**: Debounced input (300ms delay) to reduce API calls while typing
- **Integration**: Works seamlessly with filters and sorting - search results are combined with active filters using MongoDB query composition
- **Backend**: Handled by `QueryBuilder.search()` method which constructs `$or` conditions with regex patterns
- **Frontend**: `SearchBar` component manages local state and debouncing before updating URL parameters

## Filter Implementation Summary

Multi-dimensional filtering system supporting independent and combined filter operations:

- **Multi-Select Filters**: Region, Gender, Payment Method, Order Status, Product Category, Delivery Type, Store Location - implemented using MongoDB `$in` operator for array matching
- **Tag Filtering**: Special handling for product tags array using `$in` operator to match any selected tags
- **Range Filters**: 
  - Age Range: Numeric range with min/max values using MongoDB `$gte` and `$lte` operators
  - Amount Range: Transaction amount filtering with configurable min/max bounds
- **Date Range Filter**: Start and end date pickers using MongoDB date comparison operators
- **Filter UI**: Accordion-based filter panel with active filter badges, clear all functionality, and mobile-responsive drawer
- **Backend**: `QueryBuilder` class handles all filter types through dedicated methods (`multiSelectFilter`, `rangeFilter`, `dateRangeFilter`, `tagFilter`)
- **State Management**: Filters are synced with URL parameters for shareable links and browser history support

## Sorting Implementation Summary

Column-based sorting with ascending/descending toggle functionality:

- **Sortable Columns**: Transaction ID, Date (default: newest first), Customer Name (A-Z / Z-A), Amount (High to Low / Low to High), Quantity
- **Implementation**: MongoDB `sort()` method with field mapping between frontend column names and database schema fields
- **Default Sort**: Date descending (newest transactions first)
- **UI**: Clickable column headers with visual indicators (chevron up/down) showing current sort direction
- **Toggle Behavior**: Clicking the same column toggles between ascending and descending; clicking a different column sets it to descending
- **Backend**: `QueryBuilder.sort()` method maps frontend field names to database fields and constructs sort options object
- **State Preservation**: Sorting state is maintained in URL parameters and preserved across page navigation and filter changes

## Pagination Implementation Summary

Server-side pagination with comprehensive navigation controls:

- **Page Size**: 10 items per page (configurable via `limit` parameter)
- **Navigation**: Previous/Next buttons, page number buttons with ellipsis for large page counts, jump forward/back 5 pages
- **Display**: Shows current range (e.g., "Showing 1 to 10 of 830,000 results") and total count
- **Backend**: MongoDB `skip()` and `limit()` methods for efficient data retrieval, with `countDocuments()` for total count calculation
- **Pagination Metadata**: Returns `page`, `limit`, `totalCount`, `totalPages`, `hasNextPage`, `hasPrevPage` in API response
- **URL Integration**: Page number stored in URL parameters for shareable links and browser back/forward support
- **State Management**: Automatically resets to page 1 when filters or search change, preserving page number when only sorting changes
- **Performance**: Uses `lean()` queries for faster MongoDB responses and parallel execution of data fetch and count queries

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd truestate/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/truestate
PORT=5000
```

5. Seed the database with transaction data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd truestate/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Access the Application

Open your browser and navigate to `http://localhost:5173`

### Production Build

To build for production:

**Frontend:**
```bash
cd truestate/frontend
npm run build
```

**Backend:**
```bash
cd truestate/backend
npm start
```
