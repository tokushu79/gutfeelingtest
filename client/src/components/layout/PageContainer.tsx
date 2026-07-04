import type { ReactNode } from "react";
import clsx from "clsx";

export function PageContainer({
  children,
  className,
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <main className={clsx("mx-auto w-full px-4 py-10 sm:px-6 sm:py-14", narrow ? "max-w-3xl" : "max-w-6xl", className)}>
      {children}
    </main>
  );
}
