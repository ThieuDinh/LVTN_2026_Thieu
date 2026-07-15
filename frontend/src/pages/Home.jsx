import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import Navbar from "../components/layout/Navbar";
import BannerSlider from "../components/sections/BannerSlider";
import CategoryGrid from "../components/sections/CategoryGrid";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <BannerSlider />
        <CategoryGrid />
        <FeaturedProducts />
      </main>
    </div>
  );
}
