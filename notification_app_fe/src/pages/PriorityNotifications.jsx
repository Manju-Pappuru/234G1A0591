import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { fetchNotifications } from "../services/notificationApi";
import NotificationList from "../components/NotificationList";
import { Log } from "../utils/logger";

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const LIMIT_OPTIONS = [10, 15, 20];
const TYPE_OPTIONS = ["All", "Placement", "Result", "Event"];

function sortByPriorityThenRecency(items) {
  return [...items].sort((a, b) => {
    const weightA = TYPE_WEIGHTS[a.notification_type] ?? 0;
    const weightB = TYPE_WEIGHTS[b.notification_type] ?? 0;

    if (weightB !== weightA) return weightB - weightA;

    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return timeB - timeA;
  });
}

export default function PriorityNotifications() {
  const [limit, setLimit] = useState(10);
  const [notificationType, setNotificationType] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      const raw = localStorage.getItem("campus_notifications_viewed_ids");
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        Log("PriorityNotifications.load", "info", "notification_app_fe", "Priority inbox load started", {
          limit,
          notificationType,
        });

        const payload = await fetchNotifications({
          page: 1,
          limit: Math.max(limit, 50),
          notification_type: notificationType === "All" ? undefined : notificationType,
        });

        if (!active) return;

        const filtered = notificationType === "All"
          ? payload.notifications
          : payload.notifications.filter((item) => item.notification_type === notificationType);

        setNotifications(sortByPriorityThenRecency(filtered).slice(0, limit));
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load priority inbox.");
        Log("PriorityNotifications.load", "error", "notification_app_fe", "Priority inbox load failed", {
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
  }, [limit, notificationType]);

  const handleOpen = (notification) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(String(notification.id));
      localStorage.setItem("campus_notifications_viewed_ids", JSON.stringify([...next]));
      return next;
    });
  };

  const subtitle = useMemo(
    () => `Top ${limit} notifications filtered by ${notificationType.toLowerCase()}`,
    [limit, notificationType],
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Priority Inbox
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}. Sorted by priority weight and recency.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="limit-label">Top N</InputLabel>
                <Select
                  labelId="limit-label"
                  label="Top N"
                  value={limit}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setLimit(value);
                    Log("PriorityNotifications.limit", "info", "notification_app_fe", "Top N changed", {
                      limit: value,
                    });
                  }}
                >
                  {LIMIT_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      Top {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="type-label">Notification Type</InputLabel>
                <Select
                  labelId="type-label"
                  label="Notification Type"
                  value={notificationType}
                  onChange={(e) => {
                    setNotificationType(e.target.value);
                    Log("PriorityNotifications.type", "info", "notification_app_fe", "Filter changed", {
                      notificationType: e.target.value,
                    });
                  }}
                >
                  {TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {loading ? (
            <Typography variant="body1" color="text.secondary">
              Loading priority notifications...
            </Typography>
          ) : (
            <NotificationList
              notifications={notifications}
              viewedIds={viewedIds}
              onOpen={handleOpen}
              emptyMessage="No priority notifications match the selected filters."
            />
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
