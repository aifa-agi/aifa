// @app/@left/(_public)/(_CHAT)/(chat)/(_components)/role-status.tsx

import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";

// Helper function to get background color based on user type.
// It's co-located here as it's only used by this component.
const getUserTypeBackgroundColor = (userType: string): string => {
  switch (userType) {
    case "admin":
      return "bg-red-500";
    case "editor":
      return "bg-green-500";
    case "architect":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

/**
 * Renders a footer status bar.
 * - For privileged users (admin, editor, architect), it shows a colored bar with their role.
 * - For all other users, it shows a "Powered by AIFA" link.
 */
export async function RoleStatus() {
  // Fetch session data within the component that needs it.
  const session = await auth();
  const user = session?.user;

  // Determine if the user has a privileged role.
  const isPrivilegedUser =
    user?.type && ["architect", "editor", "admin"].includes(user.type);

  if (isPrivilegedUser) {
    return (
      <div
        className={`fixed bottom-0 grid h-3 w-full place-items-center ${getUserTypeBackgroundColor(
          user.type
        )} text-[8px] text-white`}
      >
        {user.type.toUpperCase()}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 flex w-full items-center justify-center py-1 text-[8px]">
      <span>
        Powered by{" "}
        <a
          href="https://github.com/aifa-agi/aifa"
          className="font-semibold underline hover:text-primary-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          AIFA
        </a>
      </span>
    </div>
  );
}
