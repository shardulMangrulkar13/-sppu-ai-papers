import { Link } from "react-router-dom";

function Copyright() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>Copyright Policy</h1>

        <p className="legal-updated">Last updated: August 9, 2026</p>

        <h2>Educational Content</h2>

        <p>
          SPPU AI Papers is an educational platform designed to help students
          find and use question papers for exam preparation.
        </p>

        <h2>Third-Party Materials</h2>

        <p>
          Some question papers or other resources available through the platform
          may be created or owned by third parties. We do not claim ownership of
          such materials unless explicitly stated.
        </p>

        <h2>Copyright Concerns</h2>

        <p>
          If you are the copyright owner or an authorized representative and
          believe that material available through this website infringes your
          rights, please contact our team with details of the material and your
          concern.
        </p>

        <h2>Review and Removal</h2>

        <p>
          We will review legitimate copyright concerns and may take appropriate
          action regarding material when necessary.
        </p>

        <h2>Contact</h2>

        <p>
          For copyright-related concerns, please contact the SPPU AI Papers
          team.
        </p>
      </div>
    </div>
  );
}

export default Copyright;
