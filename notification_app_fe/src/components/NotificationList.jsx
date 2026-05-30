import { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import NotificationCard from "./NotificationCard";
import { Log } from "../utils/logger";

export default function NotificationList({ notifications, viewedIds, onOpen, emptyMessage }) {
  useEffect(() => {
    Log("NotificationList.useEffect", "info", "notification_app_fe", "Rendering notification list", {
      count: notifications.length,
    });
  }, [notifications.length]);

  if (!notifications.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {notifications.map((notification) => (
        <Grid item xs={12} md={6} lg={4} key={notification.id}>
          <NotificationCard
            notification={notification}
            viewed={viewedIds.has(notification.id)}
            onOpen={onOpen}
          />
        </Grid>
      ))}
    </Grid>
  );
}
