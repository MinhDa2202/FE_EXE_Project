import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import s from "./CategoriesSection.module.scss";

const CategoriesSection = () => {
  const { t } = useTranslation();
  const categoriesSection = "sectionTitles.categoriesSection";

  const categories = [
    {
      id: 1,
      name: "Laptops",
      icon: "💻",
      description: "Gaming & Business",
      count: "150+ Products",
      color: "var(--primary-blue)"
    },
    {
      id: 2,
      name: "Cameras",
      icon: "📷",
      description: "DSLR & Mirrorless",
      count: "80+ Products",
      color: "var(--secondary-blue)"
    },
    {
      id: 3,
      name: "Audio",
      icon: "🎧",
      description: "Headphones & Speakers",
      count: "120+ Products",
      color: "var(--accent-blue)"
    },
    {
      id: 4,
      name: "Gaming",
      icon: "🎮",
      description: "Consoles & Accessories",
      count: "200+ Products",
      color: "var(--neon-orange)"
    },
    {
      id: 5,
      name: "Smartphones",
      icon: "📱",
      description: "Latest Models",
      count: "100+ Products",
      color: "var(--primary-blue-light)"
    },
    {
      id: 6,
      name: "Accessories",
      icon: "🔌",
      description: "Cables & Adapters",
      count: "300+ Products",
      color: "var(--secondary-blue)"
    }
  ];

  return (
    <section className={s.categoriesSection}>
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${categoriesSection}.title`)}
          sectionName={t(`${categoriesSection}.browseByCategory`)}
        />
        <p className={s.sectionDescription}>
          Explore our wide range of tech categories and find exactly what you need
        </p>
      </div>

      <div className={s.categoriesGrid}>
        {categories.map((category) => (
          <Link 
            to={`/category/${category.id}`} 
            key={category.id} 
            className={s.categoryCard}
          >
            <div className={s.categoryIcon} style={{ backgroundColor: category.color }}>
              <span className={s.icon}>{category.icon}</span>
            </div>
            <div className={s.categoryContent}>
              <h3 className={s.categoryName}>{category.name}</h3>
              <p className={s.categoryDescription}>{category.description}</p>
              <span className={s.productCount}>{category.count}</span>
            </div>
            <div className={s.hoverEffect}>
              <span className={s.arrowIcon}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
