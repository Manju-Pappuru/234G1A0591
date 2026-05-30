import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { fetchNotifications } from "../services/notificationApi";
import NotificationList from "../components/NotificationList";
import { Log } from "../utils/logger";

const PAGE_SIZE = 12;
const VIEWED_KEY = "campus_notifications_viewed_ids";

function readViewedIds() {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function persistViewedIds(viewedIds) {
  localStorage.setItem(VIEWED_KEY, JSON.stringify([...viewedIds]));
}

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState(() => readViewedIds());

  useEffect(() => {
    Log("AllNotifications.useEffect", "info", "notification_app_fe", "Page loaded", {
      page,
    });
  }, [page]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchNotifications({ page, limit: PAGE_SIZE });
        if (!active) return;
        setNotifications(response.notifications);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load notifications.");
        Log("AllNotifications.load", "error", "notification_app_fe", "Failed to load notifications", {
          message: err.message,
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [page]);

  const pagedNotifications = useMemo(() => notifications, [notifications]);

  const handleOpen = (notification) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(String(notification.id));
      persistViewedIds(next);
      Log("AllNotifications.handleOpen", "info", "notification_app_fe", "Marked notification as viewed", {
        id: notification.id,
      });
      return next;
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            All Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse campus updates with pagination and viewed state persistence.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
          {loading ? (
            <Typography variant="body1" color="text.secondary">
              Loading notifications...
            </Typography>
          ) : (
            <NotificationList
              notifications={pagedNotifications}
              viewedIds={viewedIds}
              onOpen={handleOpen}
              emptyMessage="No notifications available."
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => {
                setPage(value);
                Log("AllNotifications.pagination", "info", "notification_app_fe", "Pagination changed", {
                  page: value,
                });
              }}
              color="primary"
            />
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
