import React from 'react';

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse bg-white/20 ${className}`}></div>
);

export const LoadingSkeleton: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#17414F] text-white relative overflow-hidden">
      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
        {/* Timer Skeleton */}
        <Skeleton className="h-10 w-72 md:w-96 mx-auto rounded-full mb-12" />

        {/* Heading Skeleton */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mx-auto mb-3" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-5" />
          <Skeleton className="h-7 w-2/3 mx-auto" />
        </div>

        {/* Product Comparison Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-5xl mx-auto mb-12">
          {/* Old Product Skeleton */}
          <div className="flex flex-col items-center">
            <Skeleton className="w-[200px] h-[300px] md:w-[300px] md:h-[400px] mb-3 rounded-lg" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Arrow Skeleton */}
          <div className="flex justify-center items-center">
            <Skeleton className="w-16 h-10 md:w-28 md:h-16" />
          </div>

          {/* New Product Skeleton */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Skeleton className="w-[200px] h-[300px] md:w-[300px] md:h-[400px] mb-3 rounded-lg" />
              <Skeleton className="absolute -top-2 -right-2 w-16 h-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto px-4">
          <Skeleton className="h-12 w-full sm:w-1/2 rounded-full" />
          <Skeleton className="h-12 w-full sm:w-1/2 rounded-full" />
        </div>
      </section>
    </main>
  );
}; 