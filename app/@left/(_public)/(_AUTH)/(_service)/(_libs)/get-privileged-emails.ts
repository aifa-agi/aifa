// @/app/(_AUTH/(auth)/(_service)/(_libs)/get-privileged-emails.ts
import "server-only";

type PrivilegedEmails = {
  architects: string[];
  admins: string[];
  editors: string[];
};

export async function getPrivilegedEmails(): Promise<PrivilegedEmails> {
  const architectEmails = (process.env.ARCHITECT_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const editorEmails = (process.env.EDITOR_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return {
    architects: architectEmails,
    admins: adminEmails,
    editors: editorEmails,
  };
}
