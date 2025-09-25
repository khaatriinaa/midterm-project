import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname } = useLocation();
  const NAVBAR_HEIGHT = 70;

  useLayoutEffect(() => {
    // Immediately set top on Space Detail page
    if (pathname.startsWith("/space/")) {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    if (pathname === "/home") {
      const previousScroll = sessionStorage.getItem("homeScroll");

      if (previousScroll !== null && document.referrer.includes("/home")) {
        // Restore scroll from Home
        const scrollY = parseInt(previousScroll, 10);
        window.scrollTo(0, scrollY);
      } else {
        window.scrollTo(0, 0);
      }
    }

    // Restore original scroll
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
