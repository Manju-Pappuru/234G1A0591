# Campus Notifications Platform

This project contains two parts:

1. A backend stage that fetches notifications, sorts them by priority, and prints the top results.
2. A React frontend that displays all notifications and a priority inbox using React Router DOM, Axios, and Material UI.

## Project Structure

```text
234G1A0591/
├── logging middleware/
├── notification_app_be/
├── notification_app_fe/
└── README.md
```

## Backend

Location:

- [`notification_app_be`](./notification_app_be)

Main files:

- [`priorityNotifications.js`](./notification_app_be/priorityNotifications.js)
- [`Notification_System_Design.md`](./notification_app_be/Notification_System_Design.md)

### What the backend does

- Calls the Notifications API
- Fetches notification data
- Sorts notifications by priority
- Prints the top 10 notifications
- Uses the reusable logging middleware

### Backend setup

Create or update [`notification_app_be/.env`](./notification_app_be/.env):

```env
NOTIFICATIONS_API_URL=http://4.224.186.213/evaluation-service/notifications
```

Run:

```powershell
cd D:\234G1A0591\notification_app_be
node priorityNotifications.js
```

## Frontend

Location:

- [`notification_app_fe`](./notification_app_fe)

Main files:

- [`src/App.jsx`](./notification_app_fe/src/App.jsx)
- [`src/main.jsx`](./notification_app_fe/src/main.jsx)
- [`src/components/Navbar.jsx`](./notification_app_fe/src/components/Navbar.jsx)
- [`src/components/NotificationCard.jsx`](./notification_app_fe/src/components/NotificationCard.jsx)
- [`src/components/NotificationList.jsx`](./notification_app_fe/src/components/NotificationList.jsx)
- [`src/pages/AllNotifications.jsx`](./notification_app_fe/src/pages/AllNotifications.jsx)
- [`src/pages/PriorityNotifications.jsx`](./notification_app_fe/src/pages/PriorityNotifications.jsx)
- [`src/services/notificationApi.js`](./notification_app_fe/src/services/notificationApi.js)
- [`src/utils/logger.js`](./notification_app_fe/src/utils/logger.js)

### Frontend pages

- `/` - All Notifications
- `/priority` - Priority Inbox

### Frontend features

- React Router DOM navigation
- Axios API integration
- Material UI AppBar, Drawer, Card, Select, Pagination, Chip, Typography, and Grid
- Responsive desktop and mobile layout
- Viewed notification tracking with `localStorage`
- Priority filtering by:
  - Placement
  - Result
  - Event
- Top N selection:
  - Top 10
  - Top 15
  - Top 20

### Frontend setup

Run:

```powershell
cd D:\234G1A0591\notification_app_fe
npm install
npm run dev
```

The app runs on:

- `http://localhost:3000`

## Logging Middleware

The reusable logger is expected in:

- [`logging middleware/logger.js`](./logging%20middleware/logger.js)

The frontend uses:

- `Log(stack, level, package, message)`

The backend uses shared logging helpers for progress and error reporting.

## API Used

```text
GET http://4.224.186.213/evaluation-service/notifications
```

Supported query parameters:

- `limit`
- `page`
- `notification_type`

## Notification Types

- Placement
- Result
- Event

## Commit Plan

Recommended commit order:

1. Logging Middleware
2. Stage 1 Top 10 Notifications
3. React Setup
4. All Notifications Page
5. Priority Inbox Page
6. Filters + Pagination
7. Final Submission

## Notes

- The frontend is configured for Vite on port `3000`.
- If the API response shape changes, update `src/services/notificationApi.js` to match the returned payload.
- Viewed notification state is stored in browser `localStorage`.
