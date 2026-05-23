import { cn } from "@/lib/cn";

type Props = { className?: string; style?: React.CSSProperties };

export function Skeleton({ className, style }: Props) {
  return <div style={style} className={cn("shimmer rounded-2xl", className)} />;
}

export function PinSkeleton({ count = 12 }: { count?: number }) {
  const heights = [220, 320, 280, 380, 200, 340, 260, 300, 240, 360, 200, 320];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="mb-4 w-full break-inside-avoid"
          style={{ height: heights[i % heights.length] }}
        />
      ))}
    </>
  );
}
