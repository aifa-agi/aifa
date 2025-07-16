// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_hooks)/use-mobile-chat.tsx

import * as React from "react";

const MOBILE_BREAKPOINT = 1250;

export function useIsMobileChat() {
  const [isMobileChat, setIsMobileChat] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobileChat(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobileChat(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobileChat;
}
