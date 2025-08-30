// src/utils/urls.ts
export const APP_BASE_URL =
  process.env.REACT_APP_APP_BASE_URL || window.location.origin;

// ⚠️ Mets la même valeur que dans ton router.
// Si tes pages sont en /workspaces/:id/... laisse "workspaces".
// Si tu es passé au singulier, mets "workspace".
export const WORKSPACE_SEGMENT: 'workspace' | 'workspaces' = 'workspaces';

export const workspaceJoinUrl = (id: string, token: string) =>
  `${APP_BASE_URL}/${WORKSPACE_SEGMENT}/${id}/join?token=${encodeURIComponent(token)}`;
