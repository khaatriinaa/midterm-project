import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname } = useLocation();
  const NAVBAR_HEIGHT = 70; // fixed navbar height in px

  useLayoutEffect(() => {
    // Immediately set top on Space Detail page BEFORE any rendering
    if (pathname.startsWith("/space/")) {
      // Force immediate top position with no animation
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return; // Exit early to prevent any other scroll behavior
    }

    // Disable smooth scrolling temporarily for home page
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    if (pathname === "/home") {
      const previousScroll = sessionStorage.getItem("homeScroll");

      if (previousScroll !== null && document.referrer.includes("/home")) {
        // Restore scroll only if coming from inside Home
        const scrollY = parseInt(previousScroll, 10);
        window.scrollTo(0, scrollY);
      } else {
        // Otherwise (navigated from another page), always reset to top
        window.scrollTo(0, 0);
      }
    }

    // Restore original scroll behavior after positioning
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    }, 0);

    // Save scroll position on Home
    const saveScroll = () => {
      if (pathname === "/home") {
        sessionStorage.setItem("homeScroll", window.scrollY.toString());
      }
    };

    window.addEventListener("beforeunload", saveScroll);
    window.addEventListener("scroll", saveScroll);

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      window.removeEventListener("scroll", saveScroll);
      if (pathname === "/home") {
        sessionStorage.setItem("homeScroll", window.scrollY.toString());
      }
    };
  }, [pathname]);

  return null;
}
