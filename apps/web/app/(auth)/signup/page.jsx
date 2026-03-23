import { redirect } from "next/navigation";

export default function SignupPage() {
  // Signup UX is intentionally handled in landing modal to preserve current behavior.
  redirect("/landing");
}
