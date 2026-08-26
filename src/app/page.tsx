import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/home/Hero";
import { UspStrip } from "@/components/home/UspStrip";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { DealsOfDay } from "@/components/home/DealsOfDay";
import { PromoBanners } from "@/components/home/PromoBanners";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { BrandStrip } from "@/components/home/BrandStrip";
import { OurServices } from "@/components/home/OurServices";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <Container className="space-y-14 py-6 lg:space-y-20 lg:py-8">
      <Hero />
      <UspStrip />
      <CategoryStrip />
      <DealsOfDay />
      <PromoBanners />
      <FeaturedProducts />
      <BestSellers />
      <BrandStrip />
      <OurServices />
      <WhyChooseUs />
      <Newsletter />
    </Container>
  );
}
