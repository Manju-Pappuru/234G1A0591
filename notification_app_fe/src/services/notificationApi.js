import axios from "axios";
import { Log } from "../utils/logger";

const API_BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

function normalizeNotification(item, index = 0) {
  const id = item?.id ?? item?._id ?? item?.notification_id ?? `${item?.title ?? "notification"}-${index}`;
  return {
    id: String(id),
    title: item?.title ?? item?.subject ?? "Untitled notification",
    message: item?.message ?? item?.body ?? item?.description ?? "",
    notification_type: item?.notification_type ?? item?.type ?? "Event",
    priority_weight: Number(item?.priority_weight ?? item?.priority ?? 0),
    created_at: item?.created_at ?? item?.createdAt ?? item?.timestamp ?? new Date().toISOString(),
    raw: item,
  };
}

function normalizeList(payload) {
  const list = Array.isArray(payload) ? payload : payload?.data ?? payload?.notifications ?? [];
  return list.map((item, index) => normalizeNotification(item, index));
}

export async function fetchNotifications({ page = 1, limit = 10, notification_type } = {}) {
  try {
    Log("notificationApi.fetchNotifications", "info", "notification_app_fe", "API request started", {
      page,
      limit,
      notification_type,
    });

    const response = await client.get("", {
      params: {
        page,
        limit,
        ...(notification_type ? { notification_type } : {}),
      },
    });

    const notifications = normalizeList(response.data);
    const total =
      response.data?.total ??
      response.data?.count ??
      response.headers?.["x-total-count"] ??
      response.headers?.["X-Total-Count"] ??
      null;
    const totalPages =
      response.data?.total_pages ??
      response.data?.totalPages ??
      (typeof total === "number" ? Math.max(1, Math.ceil(total / limit)) : null);

    Log("notificationApi.fetchNotifications", "info", "notification_app_fe", "API request completed", {
      count: notifications.length,
    });

    return {
      notifications,
      page,
      limit,
      total: typeof total === "number" ? total : null,
      totalPages,
    };
  } catch (error) {
    Log("notificationApi.fetchNotifications", "error", "notification_app_fe", "API request failed", {
      message: error.message,
    });
    throw error;
  }
}

export async function fetchNotificationPage(options = {}) {
  return fetchNotifications(options);
}
