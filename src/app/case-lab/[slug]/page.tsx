import { redirect } from "next/navigation";

/** The case-lab test layout became the case page: old /case-lab links go there. */
export default async function CaseLabRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/project/${slug}`);
}
