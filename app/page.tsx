export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to the 7x Challenge!
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            This is a modern Next.js application with authentication, featuring
            secure sign-in and sign-up functionality.
          </p>
        </div>
      </div>
    </main>
  );
}
