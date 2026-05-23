import { PinSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <div className="h-10 w-64 rounded-2xl shimmer" />
      <div className="masonry mt-8">
        <PinSkeleton count={18} />
      </div>
    </div>
  );
}
