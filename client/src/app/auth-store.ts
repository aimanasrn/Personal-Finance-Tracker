import { create } from "zustand";

export type Workspace = {
  id: string;
  name: string;
  type: "PERSONAL" | "HOUSEHOLD";
};

type AuthState = {
  token: string | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setSession: (token: string, workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspaceId: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  workspaces: [],
  activeWorkspaceId: null,
  setSession: (token, workspaces) =>
    set({
      token,
      workspaces,
      activeWorkspaceId: workspaces[0]?.id ?? null
    }),
  setActiveWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId })
}));
