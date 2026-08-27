import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyRoomProps {
  kicker?: string;
  title: string;
  body: string;
  actions?: ReactNode;
  className?: string;
}

export function EmptyRoom({
  kicker,
  title,
  body,
  actions,
  className,
}: EmptyRoomProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        {kicker ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
            {kicker}
          </p>
        ) : null}
        <h1 className="display text-2xl text-foreground">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border bg-card/40 px-5 py-14 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          No data yet
        </p>
        {actions ? <div className="mt-4 flex justify-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
