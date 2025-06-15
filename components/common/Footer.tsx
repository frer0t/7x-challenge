import { Target } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Target className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              HabitFlow
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2025 HabitFlow. Build better habits, one day at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
