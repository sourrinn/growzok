import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ key: string }>;
}

export default async function LegacyTemplateDetailPage({ params }: Props) {
  const { key } = await params;
  redirect(`/protocols/${key}`);
}
