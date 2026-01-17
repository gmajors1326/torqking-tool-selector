"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-text-primary">
        Something went wrong!
      </h2>
      <p className="text-text-secondary">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="button-primary"
      >
        Try again
      </button>
      <a href="/" className="button-secondary">
        Return to Home
      </a>
    </div>
  );
}
