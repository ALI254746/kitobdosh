export default function AuthorSkeleton() {
  return (
    <div className="min-w-44 bg-white rounded-2xl p-4 shadow-sm flex-shrink-0">
      <div className="space-y-3">
        {/* avatar */}
        <div
          className="w-20 h-20 mx-auto rounded-full 
          bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
          bg-[length:200%_100%] animate-shimmer"
        />

        {/* name */}
        <div
          className="h-3 w-3/4 mx-auto rounded 
          bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
          bg-[length:200%_100%] animate-shimmer"
        />

        {/* books */}
        <div
          className="h-2 w-1/2 mx-auto rounded 
          bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
          bg-[length:200%_100%] animate-shimmer"
        />

        {/* button */}
        <div
          className="h-8 w-full rounded-xl 
          bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
          bg-[length:200%_100%] animate-shimmer"
        />
      </div>
    </div>
  );
}
