"use client";

import AppLayout from "../AppLayout";
import AnnouncementsView from "../../../components/views/AnnouncementsView";

export default function AnnouncementsPage() {
  return (
    <AppLayout activeView="announcements">
      <AnnouncementsView isActive={true} />
    </AppLayout>
  );
}
