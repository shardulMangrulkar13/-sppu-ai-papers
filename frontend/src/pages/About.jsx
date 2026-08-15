import { Link } from "react-router-dom";

function About() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>About Us</h1>

        <p>
          SPPU AI Papers is an educational web platform created to help students
          find and access previous-year question papers in a simple and
          organized way.
        </p>

        <h2>What We Provide</h2>

        <p>
          Students can search question papers using Branch, Academic Year,
          Pattern, and Subject. The platform also provides online PDF preview,
          downloading, and AI-powered assistance for questions related to
          papers.
        </p>

        <h2>Our Goal</h2>

        <p>
          Our goal is to make exam preparation easier by bringing useful
          question-paper resources together in one simple platform.
        </p>

        <h2>Our Team</h2>

        <p>SPPU AI Papers is developed by:</p>

        <ul>
          <li>Smaip Pimpalkar</li>
          <li>Suyash Sonavane</li>
          <li>Yuvraj Bhosle</li>
          <li>Shardul Mangrulkar</li>
        </ul>

        <h2>Feedback</h2>

        <p>
          We are continuously improving the platform. If you find an issue or
          have a suggestion, please contact us.
        </p>
      </div>
    </div>
  );
}

export default About;
