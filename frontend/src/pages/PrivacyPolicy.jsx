import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>Privacy Policy</h1>

        <p className="legal-updated">Last updated: August 9, 2026</p>

        <p>
          Welcome to SPPU AI Papers. We respect your privacy and are committed
          to protecting information related to your use of our website.
        </p>

        <h2>1. Information We Collect</h2>

        <p>
          SPPU AI Papers does not require users to create an account to search
          and access question papers.
        </p>

        <p>
          Depending on how you use the website, basic technical information such
          as browser type, device information, IP address, and general usage
          information may be collected by services used to operate and improve
          the website.
        </p>

        <h2>2. How We Use Information</h2>

        <p>
          Information may be used to operate, maintain, improve, secure, and
          understand the usage of the website and its features.
        </p>

        <h2>3. Cookies and Advertising</h2>

        <p>
          If advertising services such as Google AdSense are enabled on this
          website, Google and other third-party vendors may use cookies to serve
          advertisements based on a user's previous visits to this website or
          other websites.
        </p>

        <p>
          Google's use of advertising cookies enables Google and its partners to
          serve advertisements to users based on their visits to this website
          and other websites.
        </p>

        <p>
          Users may manage or opt out of personalized advertising through
          Google's Ads Settings.
        </p>

        <p>
          More information about Google's advertising policies can be found on
          Google's official website.
        </p>

        <h2>4. Third-Party Services</h2>

        <p>
          Our website may use third-party services for hosting, storage,
          analytics, advertising, AI services, and other technical
          functionality.
        </p>

        <p>
          These services may process information according to their own privacy
          policies and terms.
        </p>

        <h2>5. Question Papers and Educational Content</h2>

        <p>
          SPPU AI Papers is an educational platform designed to help students
          find and access previous-year question papers and related study
          resources.
        </p>

        <p>
          Some educational materials available through the platform may
          originate from third parties. We do not claim ownership of third-party
          materials unless explicitly stated.
        </p>

        <p>
          If you believe that material available through the website infringes
          your rights, please contact us so that we can review the matter.
        </p>

        <h2>6. External Links</h2>

        <p>
          Our website may contain links to external websites. We are not
          responsible for the privacy practices or content of external websites.
        </p>

        <h2>7. Children's Privacy</h2>

        <p>
          Our website is intended for students and general educational use. We
          do not knowingly request personal information from children.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>

        <p>
          We may update this Privacy Policy when necessary to reflect changes to
          the website, services, or applicable requirements. Any updated version
          will be published on this page.
        </p>

        <h2>9. Contact Us</h2>

        <p>
          If you have questions, suggestions, or concerns about this Privacy
          Policy, please contact the SPPU AI Papers team.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
