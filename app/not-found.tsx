import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-text-primary">
        Page Not Found
      </h2>
      <p className="text-text-secondary">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="button-primary">
        Return to Home
      </Link>
    </div>
  );
}
