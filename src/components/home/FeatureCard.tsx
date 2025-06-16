import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeatureCardProps } from "@/types";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
}: FeatureCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <Icon className={`h-12 w-12 ${iconColor} mx-auto mb-4`} />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
