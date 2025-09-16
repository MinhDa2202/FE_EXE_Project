import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { camelCase } from "src/Functions/helper";
import SvgIcon from "../../MiniComponents/SvgIcon";
import s from "./CategoryCard.module.scss";

const CategoryCard = ({ categoryData }) => {
  const { iconName, name, id } = categoryData;
  const { t } = useTranslation();
  const categoryTitleTrans = t(`categoriesData.${camelCase(name)}`, name);

  return (
    <Link
      to={`/category?id=${id}&name=${name.toLowerCase()}`}
      className={s.card}
      title={categoryTitleTrans}
    >
      <SvgIcon name={iconName} />
      <span>{name}</span>
    </Link>
  );
};
export default CategoryCard;
