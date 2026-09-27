import { notFound } from "next/navigation";
import GroupView from "@/components/porto/group-view";
import rawGroups from "@/data/porto-desain.json";
import type { PortoGroup } from "@/components/porto/lightbox";

const groups = rawGroups as PortoGroup[];

export function generateStaticParams() {
  return groups.map((g) => ({ slug: g.slug }));
}

export default async function DesainGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = groups.find((g) => g.slug === slug);
  if (!group) notFound();

  const allGroups = groups.map((g) => ({
    title: g.title,
    slug: g.slug,
    count: g.count,
  }));

  return <GroupView group={group} allGroups={allGroups} />;
}
