import { useAuthStore } from "../../app/auth-store";

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useAuthStore();

  return (
    <select
      value={activeWorkspaceId ?? ""}
      onChange={(event) => setActiveWorkspace(event.target.value)}
      className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
    >
      {workspaces.length === 0 ? <option value="">Select workspace</option> : null}
      {workspaces.map((workspace) => (
        <option key={workspace.id} value={workspace.id}>
          {workspace.name}
        </option>
      ))}
    </select>
  );
}
