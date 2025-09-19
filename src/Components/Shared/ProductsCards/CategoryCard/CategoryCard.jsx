import { useTranslation } from "react-i18next";
import { camelCase } from "src/Functions/helper";
import SvgIcon from "../../MiniComponents/SvgIcon";
import s from "./CategoryCard.module.scss";

const CategoryCard = ({ categoryData, onClick }) => {
  const { iconName, name, id } = categoryData;
  const { t } = useTranslation();
  const categoryTitleTrans = t(`categoriesData.${camelCase(name)}`, name);

  return (
    <div
      className={s.card}
      title={categoryTitleTrans}
      onClick={onClick}
      role="link"
      tabIndex={0}
    >
      <SvgIcon name={iconName} />
      <span>{name}</span>
    </div>
  );
};
export default CategoryCard;
