---
name: backend-skill
description: Use when working with Firebase, Firestore, authentication, or backend data for the Ryokan hotel reservation app. Covers data models, API layer patterns, hooks, and authentication flow.
---

# Backend Skill — Ryokan (Firebase + Firestore)

## Firestore Data Model

### Users (`Users/{uid}`)
| Field | Type | Notes |
|-------|------|-------|
| `uid` | string | Firebase Auth UID |
| `name` | string | Display name |
| `email` | string | User email |
| `role` | `"guest"` or `"admin"` | Access control |
| `createdAt` | Timestamp | Server timestamp |

### Hotels (`Hotels/{hotelId}`)
| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Hotel name |
| `location` | string | City / area |
| `description` | string | Full description |
| `rating` | number | 0–5 |
| `pricePerNight` | number | Base price |
| `images` | string[] | Image URLs |
| `createdAt` | Timestamp | Server timestamp |

### Rooms (`Rooms/{roomId}`)
| Field | Type | Notes |
|-------|------|-------|
| `hotelId` | string | Ref → Hotels |
| `type` | string | e.g. "Standard", "Deluxe", "Suite" |
| `pricePerNight` | number | Per-night price |
| `capacity` | number | Max guests |
| `amenities` | string[] | e.g. ["WiFi", "TV"] |
| `createdAt` | Timestamp | Server timestamp |

### Bookings (`Bookings/{bookingId}`)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | string | Ref → Users |
| `roomId` | string | Ref → Rooms |
| `checkInDate` | Timestamp | Start date |
| `checkOutDate` | Timestamp | End date |
| `totalPrice` | number | Calculated from nights × price |
| `numberOfGuests` | number | Guest count |
| `status` | `"confirmed"` or `"cancelled"` | Booking state |
| `createdAt` | Timestamp | Server timestamp |

---

## Architecture Pattern

```
src/
  api/*.js          — Firestore data access (read/write/delete)
  hooks/*.js        — TanStack React Query wrappers (useQuery / useMutation)
  pages/*.jsx       — Route-level components (compose hooks + components)
  components/*.jsx  — Reusable UI (display data via props)
  store/store.js    — Zustand (auth user only, not server data)
```

### Layer rules
- **Components never call Firestore directly** — they use hooks or receive data via props.
- **Hooks never contain business logic** — they delegate to API functions and manage query state.
- **API functions are pure Firestore operations** — no React, no caching, no state.

---

## API Layer Pattern (`src/api/*.js`)

Each entity has an API module exporting plain async functions:

```js
// Read all
export const getEntity = async () => { ... }

// Read single
export const getEntityById = async (id) => { ... }

// Create
export const addEntity = async (data) => { ... }

// Update
export const updateEntity = async ({ id, data }) => { ... }

// Delete
export const deleteEntity = async (id) => { ... }
```

Use `addDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc` from Firestore.
Use `serverTimestamp()` for `createdAt` fields.

---

## Hook Pattern (`src/hooks/*.js`)

Each set of API functions is wrapped with TanStack Query:

```js
// Query hook
export const useEntities = () => useQuery({
  queryKey: ['entities'],
  queryFn: () => getEntities(),
  staleTime: 60_000,
})

// Mutation hook
export const useAddEntity = () => useMutation({
  mutationFn: (data) => addEntity(data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
})
```

Common cache invalidation patterns:
- `onSuccess` of a create → invalidate the list query
- `onSuccess` of an update → invalidate both list and single-item queries
- `onSuccess` of a delete → invalidate the list query

---

## Authentication Flow

1. User registers/logs in via Firebase Auth (`auth.js` helpers)
2. On registration: user doc created in `Users/{uid}` with `role: 'guest'`
3. `App.jsx` listens to `onAuthStateChanged` → fetches user doc from Firestore → stores in Zustand
4. Components read `user` from Zustand store
5. Admin routes guarded by `AdminRoute.jsx` checking `user.role === 'admin'`

```js
// Zustand store shape
{ user: { uid, name, email, role } | null, setUser: (user) => {} }
```

---

## Booking Conflict Detection

In `bookingApi.js`, `createBooking()` prevents double-booking by:
1. Querying `Bookings` for the same `roomId` where `status == 'confirmed'`
2. Checking for date overlap: `checkInDate < existing.checkOutDate && checkOutDate > existing.checkInDate`
3. Also validates `numberOfGuests <= room.capacity`

---

## Security Rules Guidance

When writing Firestore security rules for this schema:
- **Users collection**: only the owner (`request.auth.uid == uid`) or admins can read; users can write own doc on creation
- **Hotels collection**: readable by all; writeable by admins only
- **Rooms collection**: readable by all; writeable by admins only
- **Bookings collection**: users can read own bookings (`resource.data.userId == request.auth.uid`); admins can read all; users can create with own userId; status changes may be admin-only

---

## Environment Setup

All Firebase config is loaded from Vite environment variables in `src/firebase/firebase.js`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The `.env` file is gitignored. Service account files (`src/firebase/serviceAccount.js`) are also gitignored.
