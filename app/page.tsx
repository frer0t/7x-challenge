import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <main>
      <h1 className="text-3xl font-bold underline">
        Welcome to the 7x Challenge!
      </h1>
      <p className="mt-4">
        This is a starter template for your Next.js application.
      </p>
      <Button className="mt-4" onClick={signUp}>
        Sign Up
      </Button>
      <Button className="mt-2" onClick={signIn} variant="secondary">
        Sign In
      </Button>

      {session ? (
        <p>Welcome back, {session.user.name}!</p>
      ) : (
        <p className="mt-4">You are not signed in.</p>
      )}
    </main>
  );
}
