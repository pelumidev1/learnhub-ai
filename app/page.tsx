import { redirect } from "next/navigation";

/**
 * Root route. The public marketing landing lives in /marketing (static) for now
 * and will move here as a Server Component. Until then, route people into the app:
 * middleware bounces unauthenticated users to /login.
 */
export default function Home() {
  redirect("/dashboard");
}
