import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileSkeleton() {
  return (
    <div className="flex justify-evenly items-center p-8 min-h-screen overflow-y-auto md:flex-row flex-col pt-[calc(var(--nav-height))] gap-x-5">
      <div className="flex flex-col justify-center items-center gap-y-5">
        {/* User Info */}
        <Skeleton className="h-12 w-60 rounded-md" /> {/* Username */}
        <Skeleton className="w-68 h-68 rounded-full mt-2" /> {/* Avatar Image */}
        <Skeleton className="h-8 w-70 rounded-md" /> {/* Full Name */}
        <Skeleton className="h-8 w-88 rounded-md" /> {/* Email */}
        <Skeleton className="h-8 w-76 rounded-md" /> {/* Phone */}
        <Skeleton className="h-8 w-60 rounded-md" /> {/* Gender */}
      </div>

      <div className="space-y-8 mt-8 w-120">
        {/* Bio */}
        <div className="grid w-full gap-1">
          <Skeleton className="h-7 w-16 rounded-md mb-2" /> {/* Label */}
          <Skeleton className="h-40 w-full rounded-md" /> {/* Textarea */}
          <Skeleton className="h-5 w-65 rounded-md mt-2" /> {/* helper text */}
        </div>
        {/* Button */}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
