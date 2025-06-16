"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import {
  Activity,
  BarChart3,
  LogOut,
  Menu,
  Target,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboardPage = pathname?.startsWith("/dashboard");

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href={"/"}
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              HabitFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dashboard Navigation */}
            {session?.user && isDashboardPage && (
              <div className="flex items-center space-x-2 mr-4">
                <Link href="/dashboard">
                  <Button
                    variant={pathname === "/dashboard" ? "default" : "ghost"}
                    size="sm"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Overview
                  </Button>
                </Link>
                <Link href="/dashboard/habits">
                  <Button
                    variant={
                      pathname === "/dashboard/habits" ? "default" : "ghost"
                    }
                    size="sm"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    My Habits
                  </Button>
                </Link>
                <Link href="/dashboard/analytics">
                  <Button
                    variant={
                      pathname === "/dashboard/analytics" ? "default" : "ghost"
                    }
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </div>
            )}

            {/* Auth Section */}
            {isPending ? (
              <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
            ) : session?.user ? (
              <>
                {!isDashboardPage && (
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {/* Dashboard Navigation for Mobile */}
            {session?.user && isDashboardPage && (
              <div className="space-y-2 mb-4">
                <Link href="/dashboard" onClick={closeMobileMenu}>
                  <Button
                    variant={pathname === "/dashboard" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Overview
                  </Button>
                </Link>
                <Link href="/dashboard/habits" onClick={closeMobileMenu}>
                  <Button
                    variant={
                      pathname === "/dashboard/habits" ? "default" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    My Habits
                  </Button>
                </Link>
                <Link href="/dashboard/analytics" onClick={closeMobileMenu}>
                  <Button
                    variant={
                      pathname === "/dashboard/analytics" ? "default" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </div>
            )}

            {/* Auth Section for Mobile */}
            <div className="space-y-2">
              {isPending ? (
                <div className="h-8 w-full animate-pulse bg-muted rounded"></div>
              ) : session?.user ? (
                <>
                  {!isDashboardPage && (
                    <Link href="/dashboard" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth" onClick={closeMobileMenu}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
