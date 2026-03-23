"use client";

import AppLayout from "../AppLayout";
import UsersView from "../../../components/views/UsersView";

export default function UsersPage() {
  return (
    <AppLayout activeView="users">
      <UsersView isActive={true} />
    </AppLayout>
  );
}
