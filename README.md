# React Firebase Hotel Booking Application

This project is a comprehensive hotel booking and management application built with React, leveraging Firebase for backend services, authentication, and database. It provides functionalities for users to browse hotels, view room details, make bookings, and for administrators to manage hotels, rooms, bookings, and view analytics.

## Features

*   **User Authentication:** Secure user registration and login powered by Firebase Authentication.
*   **Hotel Listings:** Browse a list of available hotels with key information.
*   **Hotel Detail Pages:** View detailed information about individual hotels, including available rooms.
*   **Room Browsing & Booking:** Explore different room types and make booking reservations.
*   **Admin Dashboard:** A dedicated administrative panel for managing the application's core data.
    *   **Manage Hotels:** Add, edit, and delete hotel listings.
    *   **Manage Rooms:** Configure room types, availability, and pricing for each hotel.
    *   **Manage Bookings:** View and manage all user bookings.
    *   **Analytics:** Visualize key application metrics using interactive charts.
*   **Role-Based Access Control:** Secure routes and features based on user roles (e.g., admin access to management pages).
*   **State Management:** Efficient and scalable state management using Zustand.
*   **Data Fetching & Caching:** Optimized data operations with React Query for a smooth user experience.
*   **Responsive User Interface:** Modern and adaptive design built with Tailwind CSS, ensuring compatibility across various devices.
*   **Interactive Charts:** Data visualization for analytics powered by Chart.js and React Chart.js 2.

## Technologies Used

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool that provides a lightning-fast development experience for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **Zustand:** A small, fast, and scalable bearbones state-management solution.
*   **React Query (TanStack Query):** Powerful asynchronous state management, data fetching, caching, and synchronization.
*   **React Router DOM:** Declarative routing for React applications.
*   **Chart.js & React Chart.js 2:** Flexible charting library and its React wrapper for stunning data visualizations.
*   **ESLint:** For consistent code quality and identifying problematic patterns.
*   **PostCSS & Autoprefixer:** For transforming CSS with JavaScript and adding vendor prefixes.

### Backend & Database

*   **Firebase:** Google's comprehensive mobile and web application development platform.
    *   **Firebase Authentication:** For secure user sign-up and sign-in.
    *   **Firestore:** A NoSQL cloud database for storing and syncing application data.
    *   **Firebase Admin SDK:** For privileged server-side interactions with Firebase services (e.g., user management, data manipulation).
    *   **(Potentially Firebase Functions):** For serverless backend logic (though not explicitly detailed, common with Firebase Admin).

## Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: [LTS version recommended](https://nodejs.org/en/download/)
*   **npm** or **Yarn**: Node.js package manager (npm comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/react-firebase-app.git
    cd react-firebase-app
    ```
    *(Note: Replace `https://github.com/your-username/react-firebase-app.git` with the actual repository URL)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Firebase Project Setup

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   Follow the setup steps to add a web app to your Firebase project. This will provide you with your Firebase configuration object.

2.  **Enable Firebase Services:**
    *   **Authentication:** Go to "Authentication" in the Firebase Console and enable desired sign-in methods (e.g., Email/Password).
    *   **Firestore Database:** Go to "Firestore Database" and create a new database. Choose a starting mode (e.g., "Start in test mode" for development, then secure rules for production).

3.  **Firebase Admin SDK Setup (Optional, for server-side logic/admin panel if direct access to services is needed):**
    *   In your Firebase project settings, go to "Service accounts."
    *   Generate a new private key. This will download a JSON file containing your service account credentials.
    *   **Crucially, keep this file secure and never expose it publicly.**
    *   You will typically use this JSON file in a server-side environment (e.g., Firebase Functions, a Node.js server, or directly in your admin-facing components if handled securely server-side).

### Environment Variables

Create a `.env` file in the root of your project to store your Firebase configuration and other sensitive variables.

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
# Add other environment variables as needed, e.g., for Firebase Admin SDK
# VITE_FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY = "path/to/your/serviceAccountKey.json" # If used directly in client (NOT RECOMMENDED)
```
*(Note: Variables prefixed with `VITE_` are exposed to your client-side code by Vite.)*

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:5173` (or the port indicated in your console).

### Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

This will compile the application into the `dist/` directory. You can then serve this `dist/` folder using a static file server or deploy it to a hosting service like Firebase Hosting, Netlify, Vercel, etc.

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

The project follows a standard React application structure with modularized components and services.

```
.
├── public/                 # Static assets
├── src/
│   ├── api/                # API client calls (e.g., to Firebase Firestore)
│   ├── assets/             # Static assets like images, icons
│   ├── components/         # Reusable UI components
│   ├── firebase/           # Firebase configuration, initialization, and auth logic
│   ├── hooks/              # Custom React hooks (e.g., for data fetching, specific logic)
│   ├── pages/              # Top-level components representing different views/routes
│   │   └── admin/          # Admin-specific pages
│   ├── routes/             # Route definitions and protected routes (e.g., AdminRoute)
│   ├── services/           # Business logic or external service integrations
│   ├── store/              # Zustand store for global state management
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point for the React application
│   └── index.css / App.css # Global styles
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration
└── ...
```

## Available Scripts

In the project directory, you can run:

*   **`npm run dev`**: Runs the app in development mode. Opens `http://localhost:5173` to view it in the browser.
    The page will reload if you make edits. You will also see any lint errors in the console.
*   **`npm run build`**: Builds the app for production to the `dist` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.
*   **`npm run lint`**: Runs ESLint to check for code quality issues and potential errors.
*   **`npm run preview`**: Serves the `dist` folder locally, allowing you to preview your production build.

## Contributing

Contributions are welcome! If you have suggestions or want to improve the project, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
