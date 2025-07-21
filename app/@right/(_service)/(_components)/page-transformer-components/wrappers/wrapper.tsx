// app/@right/(_service)/(_components)/page-transformer-components/wrappers/wrapper.tsx

import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function Wrapper({ className, children, ...props }: WrapperProps) {
  return (
    <section
      className={cn("py-10 lg:py-14 bg-background", className)}
      {...props}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
