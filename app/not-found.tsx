import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-6">
      <h2 className="text-2xl font-semibold text-industrial-900 dark:text-industrial-100">
        Page Not Found
      </h2>
      <p className="text-industrial-700 dark:text-industrial-300">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="button-primary">
        Return to Home
      </Link>
    </div>
  );
}
