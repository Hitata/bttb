import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-4 p-8">
      {session?.user ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Welcome, {session.user.name}!
          </h2>
          <p className="mt-2 text-muted-foreground">You are signed in.</p>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to BBTB</h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to get started.
          </p>
        </div>
      )}
    </div>
  );
}
