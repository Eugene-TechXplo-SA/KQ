"use client";

import AppLayout from "../AppLayout";
import SettingsView from "../../../components/views/SettingsView";

export default function SettingsPage() {
  return (
    <AppLayout activeView="settings">
      <SettingsView isActive={true} />
    </AppLayout>
  );
}
