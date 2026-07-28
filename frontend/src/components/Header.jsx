import { FileText, Home, FileSearch, Bot, Users, Phone } from "lucide-react";

function Header() {

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="header">

      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => scrollToSection("home")}
      >
        <FileText size={32} />

        <div>
          <h2>SPPU AI Papers</h2>
          <p>Question Papers + AI Assistant</p>
        </div>
      </div>

      <nav>

        <button onClick={() => scrollToSection("home")}>
          <Home size={18} />
          Home
        </button>

        <button onClick={() => scrollToSection("papers")}>
          <FileSearch size={18} />
          Papers
        </button>

        <button onClick={() => scrollToSection("ai")}>
          <Bot size={18} />
          AI Assistant
        </button>

        <button onClick={() => scrollToSection("about")}>
          <Users size={18} />
          About
        </button>

        <button onClick={() => scrollToSection("contact")}>
          <Phone size={18} />
          Contact
        </button>

      </nav>

    </header>
  );
}

export default Header;