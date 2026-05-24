import { ProtectedAppShell } from "@/components/layout/app-shell";
import { DashboardOverview } from "@/components/dashboard/recent-transactions";

export default async function DashboardPage() {
  return (
    <ProtectedAppShell
      currentPath="/dashboard"
      title="Dashboard"
      description="Start with a quick snapshot of your month, then drill into the details that need attention."
    >
      {(userId) => <DashboardOverview userId={userId} />}
    </ProtectedAppShell>
  );
}
