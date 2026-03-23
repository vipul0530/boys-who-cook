import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🍳</div>
        <h1 className="text-6xl font-bold font-heading text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold font-heading text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 max-w-sm mx-auto mb-8">
          Looks like this page got lost in the kitchen! Let&apos;s get you back on track.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
