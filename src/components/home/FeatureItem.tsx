import type { FeatureItemProps } from "@/types";

export function FeatureItem({
  icon: Icon,
  title,
  description,
  bgColor,
  iconColor,
}: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
