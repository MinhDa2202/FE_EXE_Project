import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import s from "./PagesHistory.module.scss";

const PagesHistory = ({ history, historyPaths }) => {
  const previousPages = history.slice(0, history.length - 1);
  const currentPage = history[history.length - 1];
  const navigateTo = useNavigate();
  const { t } = useTranslation();

  function navigateToPage(pageIndex) {
    console.log('Navigating to page index:', pageIndex);
    console.log('History paths:', historyPaths);
    
    // Simple navigation logic
    if (pageIndex === 0) {
      // First page (Home)
      console.log('Navigating to home page');
      navigateTo("/");
      return;
    }
    
    // For other pages, use historyPaths if available
    const clickedParam = historyPaths?.[pageIndex];
    if (clickedParam && clickedParam.path) {
      console.log('Navigating to path:', clickedParam.path);
      navigateTo(clickedParam.path);
      return;
    }
  }

  const handleClick = (e, pageIndex) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Link clicked for index:', pageIndex);
    navigateToPage(pageIndex);
  };

  return (
    <div className={s.pageHistory}>
      {previousPages.map((page, i) => {
        // Use hardcoded text for now to ensure it works
        const pageName = page === "/" ? "Home" : page;

        return (
          <div className={s.page} key={i}>
            <a 
              href="#" 
              onClick={(e) => handleClick(e, i)}
              style={{ cursor: 'pointer' }}
              className={s.clickableLink}
            >
              {pageName}
            </a>
            <span>/</span>
          </div>
        );
      })}

      <span className={s.currentPage}>{currentPage}</span>
    </div>
  );
};

export default PagesHistory;
