import { useState } from "react";
import {
  GraduationCap,
  House,
  FileSearch,
  Bot,
  Info,
  User,
  Menu,
  X,
} from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToSection(id) {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setMenuOpen(false);
  }

  const navItems = [
    {
      id: "home",
      text: "Home",
      icon: House,
    },
    {
      id: "papers",
      text: "Papers",
      icon: FileSearch,
    },
    {
      id: "about",
      text: "About",
      icon: Info,
    },
    {
      id: "developer",
      text: "Developer",
      icon: User,
    },
  ];

  return (
    <header className="header">
      <div className="logo" onClick={() => scrollToSection("home")}>
        <div className="logo-icon">
          <GraduationCap size={28} />
        </div>

        <div className="logo-text">
          <h2>SPPU AI Papers</h2>
          <span>AI Powered Study Platform</span>
        </div>
      </div>

      <nav className={menuOpen ? "nav active" : "nav"}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button key={item.id} onClick={() => scrollToSection(item.id)}>
              <Icon size={18} />
              {item.text}
            </button>
          );
        })}
      </nav>

      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
}

export default Header;
