const path = require("path");
require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DEFAULT_API_URL =
  process.env.NOTIFICATIONS_API ||
  "http://4.224.186.213/evaluation-service/notifications";

let logger = null;

try {
  logger = require(path.join(__dirname, "..", "logging middleware", "logger"));
} catch (error) {
  logger = null;
}

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function logInfo(message, meta = {}) {
  try {
    if (logger && typeof logger.info === "function") {
      logger.info(message, meta);
      return;
    }
  } catch (e) {}

  console.log(message, meta);
}

function logError(message, meta = {}) {
  try {
    if (logger && typeof logger.error === "function") {
      logger.error(message, meta);
      return;
    }
  } catch (e) {}

  console.error(message, meta);
}

async function fetchNotifications() {
  if (!ACCESS_TOKEN) {
    throw new Error("ACCESS_TOKEN missing in .env");
  }

  const response = await fetch(DEFAULT_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Notifications API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  return data.notifications || [];
}

function getTopNotifications(notifications, limit = 10) {
  return notifications
    .map((notification) => ({
      ...notification,
      weight: TYPE_WEIGHT[notification.Type] || 0,
    }))
    .sort((a, b) => {
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }

      return (
        new Date(b.Timestamp).getTime() -
        new Date(a.Timestamp).getTime()
      );
    })
    .slice(0, limit);
}

async function main() {
  try {
    console.log("Using API:", DEFAULT_API_URL);
    console.log("Token Loaded:", !!ACCESS_TOKEN);

    logInfo("Fetching notifications");

    const notifications = await fetchNotifications();

    logInfo("Notifications fetched", {
      count: notifications.length,
    });

    const top10 = getTopNotifications(notifications, 10);

    console.log("\nTOP 10 PRIORITY NOTIFICATIONS");
    console.log("=====================================\n");

    top10.forEach((notification, index) => {
      console.log(
        `${index + 1}. ${notification.Type} | ${notification.Message} | ${notification.Timestamp}`
      );
    });

    logInfo("Top 10 notifications generated", {
      count: top10.length,
    });
  } catch (error) {
    logError("Failed to process notifications", {
      error: error.message,
    });

    console.error(error.message);
  }
}

main();