import { Link } from "react-router-dom";

function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>Terms & Conditions</h1>

        <p className="legal-updated">Last updated: August 9, 2026</p>

        <h2>1. Use of the Website</h2>

        <p>
          SPPU AI Papers is provided as an educational resource to help students
          search and access previous-year question papers and related study
          resources.
        </p>

        <h2>2. Educational Purpose</h2>

        <p>
          The information and resources provided through this website are
          intended for educational and exam-preparation purposes.
        </p>

        <h2>3. Question Papers and Third-Party Content</h2>

        <p>
          Some materials available through the platform may originate from third
          parties. We do not claim ownership of third-party materials unless
          explicitly stated.
        </p>

        <p>
          If you believe that any material available through the website
          infringes your rights, please contact us so that we can review the
          matter.
        </p>

        <h2>4. Accuracy and Availability</h2>

        <p>
          We try to keep the website useful and available, but we do not
          guarantee that every resource will always be available, complete, or
          error-free.
        </p>

        <h2>5. External Services</h2>

        <p>
          The website may use third-party services for hosting, storage, AI
          functionality, analytics, advertising, or other technical services.
        </p>

        <h2>6. Changes</h2>

        <p>
          We may update these Terms & Conditions when necessary. Updated terms
          will be published on this page.
        </p>

        <h2>7. Contact</h2>

        <p>
          If you have questions regarding these terms, please contact the SPPU
          AI Papers team.
        </p>
      </div>
    </div>
  );
}

export default Terms;
