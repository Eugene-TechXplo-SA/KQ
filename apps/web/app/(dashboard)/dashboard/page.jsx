"use client";

import AppLayout from "../AppLayout";
import DashboardView from "../../../components/views/DashboardView";

export default function DashboardPage() {
  return (
    <AppLayout activeView="dashboard">
      <DashboardView isActive={true} />
    </AppLayout>
  );
}
