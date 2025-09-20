import PagesHistory from "./PagesHistory";
import containerStyles from "./BreadcrumbContainer.module.scss";

const BreadcrumbWrapper = ({ 
  history, 
  historyPaths, 
  pageType = "default",
  variant = "clean" // "clean" or "wrapped"
}) => {
  const getContainerClass = () => {
    const baseClass = containerStyles.breadcrumbContainer;
    const pageClass = containerStyles[`${pageType}PageContainer`] || "";
    const variantClass = variant === "wrapped" 
      ? containerStyles.breadcrumbWrapper 
      : containerStyles.breadcrumbClean;
    
    return `${baseClass} ${pageClass} ${variantClass}`.trim();
  };

  return (
    <div className={getContainerClass()}>
      <PagesHistory history={history} historyPaths={historyPaths} />
    </div>
  );
};

export default BreadcrumbWrapper;