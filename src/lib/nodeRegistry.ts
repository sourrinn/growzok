export interface ElementCategoryConfig {
  id: string;
  label: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  cardBorder: string;
  description: string;
}

export const ELEMENT_REGISTRY: Record<string, ElementCategoryConfig> = {
  sticky: {
    id: "sticky",
    label: "Sticky Note",
    icon: "📌",
    badgeBg: "bg-[#fef3c7] dark:bg-[#78350f]/40",
    badgeText: "text-[#92400e] dark:text-[#fde68a]",
    cardBg: "bg-[#fef3c7]/60 dark:bg-[#78350f]/20",
    cardBorder: "border-[#fde68a] dark:border-[#78350f]/40",
    description: "Yellow post-it note card for quick thoughts",
  },
  shape: {
    id: "shape",
    label: "Shape / Container",
    icon: "🔲",
    badgeBg: "bg-[#e2e8f0] dark:bg-[#27272a]",
    badgeText: "text-[#1e293b] dark:text-[#f4f4f5]",
    cardBg: "bg-[#f8fafc] dark:bg-[#18181b]",
    cardBorder: "border-[#cbd5e1] dark:border-[#3f3f46]",
    description: "Container box to cluster related note concepts",
  },
  text: {
    id: "text",
    label: "Text Box",
    icon: "📝",
    badgeBg: "bg-[#e5e1d7] dark:bg-[#27272a]",
    badgeText: "text-[#232f26] dark:text-[#f4f4f5]",
    cardBg: "bg-white dark:bg-[#18181b]",
    cardBorder: "border-[#e5e1d7] dark:border-[#27272a]",
    description: "Freeform markdown text box",
  },
  image: {
    id: "image",
    label: "Image / Media",
    icon: "🖼️",
    badgeBg: "bg-[#e0e7ff] dark:bg-[#312e81]/30",
    badgeText: "text-[#3730a3] dark:text-[#c7d2fe]",
    cardBg: "bg-[#e0e7ff]/30 dark:bg-[#312e81]/20",
    cardBorder: "border-[#c7d2fe] dark:border-[#312e81]/40",
    description: "Embedded image or diagram reference",
  },
  action: {
    id: "action",
    label: "Action Starter",
    icon: "🎯",
    badgeBg: "bg-[#e3ede6] dark:bg-[#14532d]/30",
    badgeText: "text-[#406852] dark:text-[#a3b899]",
    cardBg: "bg-[#e3ede6]/40 dark:bg-[#14532d]/20",
    cardBorder: "border-[#406852]/30 dark:border-[#14532d]/40",
    description: "Interactive task / habit entry starter",
  },
  optimistic: {
    id: "optimistic",
    label: "Optimistic Spark",
    icon: "⚡",
    badgeBg: "bg-[#fef3c7] dark:bg-[#78350f]/30",
    badgeText: "text-[#92400e] dark:text-[#fde68a]",
    cardBg: "bg-[#fef3c7]/40 dark:bg-[#78350f]/20",
    cardBorder: "border-[#fde68a] dark:border-[#78350f]/40",
    description: "Fast sub-second micro spark",
  },
  detailed: {
    id: "detailed",
    label: "Detailed Note",
    icon: "📄",
    badgeBg: "bg-[#e5e1d7] dark:bg-[#27272a]",
    badgeText: "text-[#232f26] dark:text-[#f4f4f5]",
    cardBg: "bg-white dark:bg-[#18181b]",
    cardBorder: "border-[#e5e1d7] dark:border-[#27272a]",
    description: "Rich text & markdown elaboration",
  },
};

export function getElementCategoryConfig(category: string): ElementCategoryConfig {
  return (
    ELEMENT_REGISTRY[category] || {
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      icon: "📌",
      badgeBg: "bg-[#e5e1d7] dark:bg-[#27272a]",
      badgeText: "text-[#232f26] dark:text-[#f4f4f5]",
      cardBg: "bg-white dark:bg-[#18181b]",
      cardBorder: "border-[#e5e1d7] dark:border-[#27272a]",
      description: "Custom element",
    }
  );
}

// Alias for backward compatibility
export const NODE_CATEGORY_REGISTRY = ELEMENT_REGISTRY;
export const getNodeCategoryConfig = getElementCategoryConfig;
