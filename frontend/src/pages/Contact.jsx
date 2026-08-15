import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>Contact Us</h1>

        <p>
          Have a question, suggestion, or found a problem with the website? We
          would be happy to hear from you.
        </p>

        <h2>Feedback and Suggestions</h2>

        <p>
          If you have suggestions for improving SPPU AI Papers or want to report
          an issue with the website, please contact our team.
        </p>

        <h2>Team</h2>

        <p>SPPU AI Papers Team</p>

        <p>
          Developed by Smaip Pimpalkar, Suyash Sonavane, Yuvraj Bhosle and
          Shardul Mangrulkar.
        </p>

        <p>
          For project-related queries, you can contact the team through the
          social/contact channels provided on the website.
        </p>
      </div>
    </div>
  );
}

export default Contact;
