"use client";

import AppLayout from "../AppLayout";
import ApprovalsView from "../../../components/views/ApprovalsView";

export default function ApprovalsPage() {
  return (
    <AppLayout activeView="approvals">
      <ApprovalsView isActive={true} />
    </AppLayout>
  );
}
