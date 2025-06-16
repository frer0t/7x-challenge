import {
  CallToAction,
  FeaturePreview,
  FeaturesSection,
  HeroSection,
} from "@/components/home";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-background via-primary/5 to-primary/10 px-8">
      <HeroSection />
      <FeaturePreview />
      <Separator className="my-16" />
      <FeaturesSection />
      <Separator className="my-16" />
      <CallToAction />
    </div>
  );
}
