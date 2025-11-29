import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VerifyZen
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            AI-Powered Credential{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verification
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Streamline your background checks with intelligent verification of employment history,
            education, and professional credentials. Fast, accurate, and reliable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Verifying
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Employment Verification
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Verify work history, job titles, and employment dates with AI-powered analysis
              and company database cross-referencing.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Education Verification
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Validate degrees, certifications, and educational credentials against accredited
              institutions and diploma mill databases.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Risk Assessment
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get comprehensive risk scores, timeline analysis, and actionable recommendations
              for informed hiring decisions.
            </p>
          </div>
        </div>

        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to streamline your verification process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading companies using VerifyZen for reliable credential verification.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2024 VerifyZen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
