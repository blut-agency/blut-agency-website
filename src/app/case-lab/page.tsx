import { redirect } from "next/navigation";

/** The case-lab test layout became the case page: /case-lab opens the fullest case. */
export default function CaseLabIndex() {
  redirect("/project/hyundai-are-you-in");
}
