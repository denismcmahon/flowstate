import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600}>
        Welcome to FlowState
      </Typography>
      <Typography sx={{ mt: 2 }}>
        This is your blank dashboard — we’ll add planner, habits, and Pomodoro here later.
      </Typography>
    </Box>
  );
}
