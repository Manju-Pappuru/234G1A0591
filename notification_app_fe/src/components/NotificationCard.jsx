import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Log } from "../utils/logger";

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function NotificationCard({ notification, viewed = false, onOpen }) {
  const handleOpen = () => {
    Log("NotificationCard.handleOpen", "info", "notification_app_fe", "Notification opened", {
      id: notification.id,
      type: notification.notification_type,
    });
    onOpen?.(notification);
  };

  return (
    <Card
      elevation={viewed ? 1 : 5}
      sx={{
        border: viewed ? "1px solid rgba(76,175,80,0.25)" : "1px solid rgba(255,255,255,0.08)",
        background: viewed ? "rgba(76,175,80,0.04)" : "background.paper",
      }}
    >
      <CardActionArea onClick={handleOpen}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1}>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip
                size="small"
                icon={viewed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                label={viewed ? "Viewed" : "Unread"}
                color={viewed ? "success" : "warning"}
                variant={viewed ? "outlined" : "filled"}
              />
              <Chip size="small" icon={<EventIcon />} label={notification.notification_type} variant="outlined" />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {formatDate(notification.created_at)}
            </Typography>
          </Stack>

          <Typography variant="h6" gutterBottom>
            {notification.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {notification.message || "No additional details available."}
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip
              size="small"
              label={`Priority ${notification.priority_weight ?? 0}`}
              color="primary"
              variant="outlined"
            />
            {notification.raw?.department ? (
              <Chip size="small" label={notification.raw.department} variant="outlined" />
            ) : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
