import { BookOpen, Brain, FileText, Search, Heart } from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <h2>SPPU AI Papers</h2>

      <p className="footer-text">
        AI Powered Platform for Searching, Previewing and Downloading Savitribai
        Phule Pune University Previous Year Question Papers.
      </p>

      <div className="footer-features">
        <div>
          <BookOpen size={22} />
          <span>Previous Papers</span>
        </div>

        <div>
          <Brain size={22} />
          <span>AI Assistant</span>
        </div>

        <div>
          <FileText size={22} />
          <span>PDF Preview</span>
        </div>

        <div>
          <Search size={22} />
          <span>Fast Search</span>
        </div>
      </div>

      <div className="footer-line"></div>

      {/* Legal Links */}

      <div className="footer-links">
        <Link to="/privacy">Privacy Policy</Link>

        <Link to="/about">About Us</Link>

        <Link to="/contact">Contact Us</Link>

        <Link to="/terms">Terms & Conditions</Link>

        <Link to="/copyright">Copyright Policy</Link>
      </div>

      <p className="footer-copy">
        Made with <Heart size={16} fill="red" color="red" /> by
        <strong> Shardul Mangrulkar</strong>
      </p>

      <p className="footer-copy">© 2026 SPPU AI Papers. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
