import { Helmet } from "react-helmet-async";
import { gamingLaptop } from "src/Assets/Images/Images";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import CategoriesSection from "./CategoriesSection/CategoriesSection";
import s from "./Home.module.scss";

import ProductPoster from "./ProductPoster/ProductPoster";
import ThisMonthSection from "./ThisMonthSection/ThisMonthSection";
import TodaySection from "./TodaySection/TodaySection";
import CompareSection from "./CompareSection/CompareSection";
import ProductAnalyzerSection from "./ProductAnalyzerSection/ProductAnalyzerSection";
import SmartRecommendations from "../Shared/Sections/SmartRecommendations/SmartRecommendations";
import FlashSaleBanner from "./FlashSaleBanner";

const Home = () => {
  useScrollOnMount();

  return (
    <>
      <Helmet>
        <title>Recloop Mart</title>
        <meta
          name="description"
          content="Your ultimate destination for effortless online shopping. Discover curated collections, easily add items to your cart and wishlist,and enjoy detailed product descriptions with captivating previews. Experience convenience like never before with our intuitive interface. Shop smarter with us today."
        />
        <link ref="preload" as="image" type="image/webp" href={gamingLaptop} />
      </Helmet>

      <main className={s.home}>
        <div className={s.container}>
          <TodaySection />
          <FlashSaleBanner />
          <CategoriesSection />
          <ThisMonthSection />
          <ProductPoster />

          <div className={s.featuresContainer}>
            <CompareSection />
            <ProductAnalyzerSection />
          </div>

          {/* Smart Recommendations for User Retention */}
          <SmartRecommendations />

          {/* <OurProductsSection /> */}
        </div>
      </main>
    </>
  );
};

export default Home;
