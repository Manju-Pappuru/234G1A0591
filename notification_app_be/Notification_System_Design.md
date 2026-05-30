# Notification System Design

## Stage 1 Goal
Build a small backend script that:

1. Calls the Notifications API
2. Fetches the notification list
3. Sorts notifications by priority
4. Prints the top 10 notifications
5. Uses the reusable logging middleware from `../logging middleware`

## Flow

1. Read `NOTIFICATIONS_API_URL` from the environment.
2. Send a `GET` request to the API.
3. Normalize the returned payload into an array of notifications.
4. Sort the notifications by priority in descending order.
5. Break ties using recency when a timestamp field is present.
6. Print the top 10 results to the console.
7. Record progress and failures through the shared logging middleware.

## Expected Notification Shape

The script works best when each notification includes:

- `id`
- `title` or `subject` or `message`
- `priority`
- `createdAt` or `timestamp`

## Notes

- The API endpoint is intentionally configurable so the same script can work across environments.
- The logging middleware import is kept reusable by loading it from the shared `logging middleware` folder.
