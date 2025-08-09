import * as React from "react";
import { Home, Menu as MenuIcon, ShoppingCart, User, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [aboutOpen, setAboutOpen] = React.useState(false);

  const navItems = [
    { label: translations.restaurant, icon: Home, path: "/" },
    { label: translations.menu, icon: MenuIcon, path: "/menu" },
    { label: translations.cart, icon: ShoppingCart, path: "/cart" },
    { label: translations.profile, icon: User, path: "/profile" },
    { label: translations.aboutUs, icon: Info, path: "#about", onClick: () => setAboutOpen(true) },
  ];

  const isActivePath = (base: string) =>
    base === "/" ? location.pathname === "/" :
    location.pathname === base || location.pathname.startsWith(base + "/");

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.04)] z-50">
        <nav className="flex justify-around items-center h-16 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            if (item.label === translations.aboutUs) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center flex-1 h-full"
                >
                  <item.icon className="h-6 w-6 mb-1 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">{item.label}</span>
                  <span className="h-1 w-12 rounded-full mt-1 opacity-0" />
                </button>
              );
            }
            const active = isActivePath(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center flex-1 h-full"
                aria-current={active ? "page" : undefined}
              >
                <item.icon
                  className="h-6 w-6 mb-1 transition-colors"
                  style={{ color: active ? "#D7A962" : "#6B7280" }}
                />
                <span
                  className={`text-xs font-medium ${
                    active ? "gold-text" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`h-1 w-12 rounded-full mt-1 transition-opacity duration-200 ${
                    active ? "opacity-100 gold-gradient-bg" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.aboutUsTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-800">
            <div>{translations.aboutUsWelcome}</div>
            <div>{translations.aboutUsLocation}</div>
            <div>{translations.aboutUsCuisine}</div>
            <div>{translations.aboutUsSignature}</div>
            <div>{translations.aboutUsWhyChoose}</div>
            <div>{translations.aboutUsFeatures}</div>
            <div>{translations.aboutUsTogether}</div>
            <div>{translations.aboutUsCome}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
