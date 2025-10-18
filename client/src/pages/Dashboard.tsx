import DashboardLayout from "../layouts/DashboardLayout";
import { Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight={600}>
        Welcome back!
      </Typography>
      <Typography sx={{ mt: 2 }}>
        This is your central hub — planner, habits, focus, and journal will live here.
      </Typography>
    </DashboardLayout>
  );
}