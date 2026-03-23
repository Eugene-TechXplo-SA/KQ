"use client";

import AppLayout from "../AppLayout";
import LedgerView from "../../../components/views/LedgerView";

export default function LedgerPage() {
  return (
    <AppLayout activeView="ledger">
      <LedgerView isActive={true} />
    </AppLayout>
  );
}
