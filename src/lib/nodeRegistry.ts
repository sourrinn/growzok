export interface NodeCategoryConfig {
  id: string;
  label: string;
  icon: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const NODE_CATEGORY_REGISTRY: Record<string, NodeCategoryConfig> = {
  optimistic: {
    id: "optimistic",
    label: "Optimistic Spark",
    icon: "⚡",
    accentColor: "#fef3c7",
    badgeBg: "bg-[#fef3c7] dark:bg-[#78350f]/30",
    badgeText: "text-[#92400e] dark:text-[#fde68a]",
    description: "Fast sub-second micro note / spark of intent",
  },
  detailed: {
    id: "detailed",
    label: "Detailed Note",
    icon: "📄",
    accentColor: "#e2e8f0",
    badgeBg: "bg-[#e5e1d7] dark:bg-[#27272a]",
    badgeText: "text-[#232f26] dark:text-[#f4f4f5]",
    description: "Rich text & markdown elaboration",
  },
  image: {
    id: "image",
    label: "Image / Media",
    icon: "🖼️",
    accentColor: "#e0e7ff",
    badgeBg: "bg-[#e0e7ff] dark:bg-[#312e81]/30",
    badgeText: "text-[#3730a3] dark:text-[#c7d2fe]",
    description: "Embedded visual media & diagram reference",
  },
  action: {
    id: "action",
    label: "Action Starter",
    icon: "🎯",
    accentColor: "#dcfce7",
    badgeBg: "bg-[#e3ede6] dark:bg-[#14532d]/30",
    badgeText: "text-[#406852] dark:text-[#a3b899]",
    description: "Interactive task / habit entry starter",
  },
};

export function getNodeCategoryConfig(category: string): NodeCategoryConfig {
  return (
    NODE_CATEGORY_REGISTRY[category] || {
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      icon: "📌",
      accentColor: "#f4f4f5",
      badgeBg: "bg-[#e5e1d7] dark:bg-[#27272a]",
      badgeText: "text-[#232f26] dark:text-[#f4f4f5]",
      description: "Custom node category",
    }
  );
}
