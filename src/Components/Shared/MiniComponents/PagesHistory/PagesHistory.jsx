import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SvgIcon from "../SvgIcon";
import s from "./PagesHistory.module.scss";

const PagesHistory = ({ history, historyPaths }) => {
  const previousPages = history.slice(0, history.length - 1);
  const currentPage = history[history.length - 1];
  const navigateTo = useNavigate();
  const { t } = useTranslation();

  function navigateToPage(pageIndex) {
    // Always navigate to home for index 0
    if (pageIndex === 0) {
      navigateTo("/");
      return;
    }
    
    // Use historyPaths if available
    if (historyPaths && historyPaths[pageIndex] && historyPaths[pageIndex].path) {
      navigateTo(historyPaths[pageIndex].path);
      return;
    }
    
    // Fallback: construct path from page name
    const pageName = previousPages[pageIndex];
    if (pageName && pageName !== "/") {
      // Simple path construction
      const path = `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
      navigateTo(path);
      return;
    }
    
    // Final fallback: go to home
    navigateTo("/");
  }

  const handleClick = (e, pageIndex) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToPage(pageIndex);
  };

  const handleKeyDown = (e, pageIndex) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToPage(pageIndex);
    }
  };

  return (
    <nav className={s.pageHistory} aria-label="Breadcrumb navigation" role="navigation">
      <ol style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: 0, padding: 0, listStyle: 'none' }}>
        {previousPages.map((page, i) => {
          // Get page name from historyPaths if available, otherwise use page directly
          let pageName;
          if (historyPaths && historyPaths[i] && historyPaths[i].label) {
            pageName = historyPaths[i].label;
          } else if (page === "/") {
            pageName = t("nav.home") || "Home";
          } else {
            pageName = page;
          }
          
          const isLast = i === previousPages.length - 1;

          return (
            <li key={i} className={s.page}>
              <a 
                href="#" 
                onClick={(e) => handleClick(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                aria-label={`Navigate to ${pageName}`}
                tabIndex={0}
                role="button"
              >
                {pageName}
              </a>
              {!isLast && (
                <span className={s.separator} aria-hidden="true">
                  <SvgIcon name="chevronRight" />
                </span>
              )}
            </li>
          );
        })}
        
        {previousPages.length > 0 && (
          <li>
            <span className={s.separator} aria-hidden="true">
              <SvgIcon name="chevronRight" />
            </span>
          </li>
        )}
        
        <li>
          <span className={s.currentPage} aria-current="page">
            {currentPage}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default PagesHistory;
