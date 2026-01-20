To run this project, you need to set up your Firebase configuration. Please create a `.env` file in the root directory of the project with the following variables:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

Replace `your_api_key`, `your_auth_domain`, etc., with your actual Firebase project credentials.

Once the `.env` file is configured, you can start the application using:

```bash
npm run dev
```

This will start the development server, and you can access the application in your browser, usually at `http://localhost:5173`.

**Important Firestore Setup:**
Make sure you have a Firestore database set up in your Firebase project. The application expects the following collections:
- `Users`: To store user roles (guest/admin).
- `Hotels`: To store hotel information.
- `Rooms`: To store room details, linked to hotels via `hotelId`.
- `Bookings`: To store booking records, linked to users and rooms.

You might need to manually add some initial data to these collections for testing purposes, especially for hotels and rooms, to see them displayed in the UI.

**Admin User Setup:**
To test the admin functionalities, you will need to:
1. Register a new user through the application.
2. Manually change the `role` field of this user to `admin` in your Firebase Firestore `Users` collection. This will grant them access to the Admin Dashboard.