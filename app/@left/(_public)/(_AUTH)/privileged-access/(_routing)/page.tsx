import PrivilegedLoginFooter from "../(_service)/(_components)/privileged-login-footer";
import { getPrivilegedEmails } from "../../(_service)/(_libs)/get-privileged-emails";
import PrivilegedLogin from "../(_service)/(_components)/privileged-login";

export default async function PrivilegedPage() {
  const privilegedEmails = await getPrivilegedEmails();
  return (
    <div className="relative h-dvh bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <PrivilegedLogin privilegedEmails={privilegedEmails} />
        <PrivilegedLoginFooter />
      </div>
    </div>
  );
}
