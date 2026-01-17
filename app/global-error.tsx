"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-text-primary" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-6">
          <h2 className="text-3xl font-bold text-text-primary">Something went wrong!</h2>
          <p className="text-text-secondary">{error.message || "An unexpected error occurred"}</p>
          <button
            onClick={reset}
            className="button-primary"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
