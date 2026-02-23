import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, LayoutDashboard, Instagram, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Início", icon: LayoutDashboard },
    { href: "/agendar", label: "Agendar", icon: Calendar },
    { href: "/painel", label: "Painel", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface-dark border-b border-gold/20 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
            <span className="text-sm font-bold text-primary">M</span>
          </div>
          <div>
            <h1 className="text-sm font-display font-bold text-surface-dark-foreground tracking-wide">
              Marli Cosméticos
            </h1>
            <p className="text-[10px] text-gold uppercase tracking-[0.2em]">Prime Estética</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "text-gold bg-gold/10"
                  : "text-surface-dark-foreground/70 hover:text-gold hover:bg-gold/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 text-surface-dark-foreground/50 text-xs">
          <a href="https://instagram.com/marlicosmeticos" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="tel:+5566996342599" className="hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "p-2 rounded-md transition-colors",
                location.pathname === item.href
                  ? "text-gold bg-gold/10"
                  : "text-surface-dark-foreground/70 hover:text-gold"
              )}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
