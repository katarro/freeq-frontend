import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");

  return (
    <main>
      <h1>Root</h1>
    </main>
  );
}

