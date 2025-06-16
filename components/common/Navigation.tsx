"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { Activity, BarChart3, LogOut, Target, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navigation() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardPage = pathname?.startsWith("/dashboard");

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={"/"} className="flex items-center space-x-2">
          <Target className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">HabitFlow</span>
        </Link>

        {/* Dashboard Navigation */}
        {session?.user && isDashboardPage && (
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/overview">
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
                variant={pathname === "/dashboard/habits" ? "default" : "ghost"}
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

        <div className="flex items-center space-x-4">
          {isPending ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
            </div>
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
      </div>
    </nav>
  );
}
