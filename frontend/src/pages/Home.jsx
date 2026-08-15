import { useEffect, useRef, useState } from "react";
import axios from "axios";

import SearchBar from "../components/SearchBar";
import SubjectCard from "../components/SubjectCard";
import StatsCard from "../components/statsCard";
import AIChat from "../components/AIChat";
import developerImg from "../assets/shardul.JPG";

const API = "https://sppu-ai-backend-304115043483.asia-south1.run.app";

function Home() {
  const [papers, setPapers] = useState(() => {
    const saved = sessionStorage.getItem("sppu-papers");

    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    sessionStorage.setItem("sppu-papers", JSON.stringify(papers));
  }, [papers]);

  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem("sppu-filters");

    return saved
      ? JSON.parse(saved)
      : {
          branch: "",
          year: "",
          pattern: "",
          subject: "",
        };
  });
  useEffect(() => {
    sessionStorage.setItem("sppu-filters", JSON.stringify(filters));
  }, [filters]);
  const resultsRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  // Branch -> Years

  useEffect(() => {
    if (!filters.branch) {
      setYears([]);
      setPatterns([]);
      setSubjects([]);

      return;
    }

    loadYears(filters.branch);
  }, [filters.branch]);

  // Year -> Pattern

  useEffect(() => {
    if (!filters.year) {
      setPatterns([]);
      setSubjects([]);

      return;
    }

    loadPatterns(filters.branch, filters.year);
  }, [filters.year]);

  // Pattern -> Subject

  useEffect(() => {
    if (!filters.pattern) {
      setSubjects([]);

      return;
    }

    loadSubjects(filters.branch, filters.year, filters.pattern);
  }, [filters.pattern]);

  async function loadBranches() {
    const res = await axios.get(`${API}/branches`);

    setBranches(res.data);
  }

  async function loadYears(branch) {
    const res = await axios.get(`${API}/years`, {
      params: {
        branch,
      },
    });

    setYears(res.data);
  }

  async function loadPatterns(branch, year) {
    const res = await axios.get(`${API}/patterns`, {
      params: {
        branch,

        year,
      },
    });

    setPatterns(res.data);
  }

  async function loadSubjects(branch, year, pattern) {
    const res = await axios.get(`${API}/subjects`, {
      params: {
        branch,

        year,

        pattern,
      },
    });

    setSubjects(res.data);
  }

  async function searchPapers() {
    setLoading(true);

    try {
      const res = await axios.get(`${API}/papers`, {
        params: filters,
      });

      setPapers(res.data);

      // Wait for React to render the results,
      // then smoothly scroll to the papers section.
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-left">
          <span className="hero-tag">
            AI Powered SPPU Question Paper Platform
          </span>

          <h1>
            Search Previous Year
            <br />
            Question Papers
          </h1>

          <p>
            Find, preview and download previous year SPPU question papers
            instantly.
          </p>

          <SearchBar
            branches={branches}

            years={years}

            patterns={patterns}

            subjects={subjects}

            filters={filters}

            setFilters={setFilters}

            onSearch={searchPapers}
          />
        </div>

        <div className="hero-right">
          <AIChat />
        </div>
      </section>

      <section className="stats-grid">
        <StatsCard
          title="Question Papers"

          value={papers.length}

          color="#2563eb"
        />

        <StatsCard
          title="Branches"

          value={branches.length}

          color="#16a34a"
        />

        <StatsCard
          title="Subjects"

          value={subjects.length}

          color="#f97316"
        />

        <StatsCard
          title="AI Support"

          value="24/7"

          color="#9333ea"
        />
      </section>

      <section ref={resultsRef} className="papers-section" id="papers">
        <div className="section-header">
          <h2>Previous Year Papers</h2>

          <p>
            {papers.length} Result
            {papers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <h2 className="loading">Loading...</h2>
        ) : papers.length === 0 ? (
          <div className="empty-state">
            <h2>No Papers Found</h2>

            <p>Select Branch, Academic Year, Pattern, Subject then Search.</p>
          </div>
        ) : (
          <div className="paper-grid">
            {papers.map((paper, index) => (
              <SubjectCard
                key={index}

                paper={paper}
              />
            ))}
          </div>
        )}
      </section>

      {/* Developer Section */}

      <section className="developer-section" id="developer">
        <div className="developer-card">
          <img
            src={developerImg}
            alt="Shardul Mangrulkar"
            className="developer-image"
          />

          <div className="developer-content">
            <h2>Shardul Mangrulkar</h2>

            <h4>
              Electronics & Telecommunication Engineering Student | Full Stack
              AI Developer
            </h4>

            <p>
              Hi, I'm <strong>Shardul Mangrulkar</strong>, an Electronics &
              Telecommunication Engineering student and Full Stack AI Developer.
              I enjoy building AI-powered web applications using React, FastAPI,
              Python and modern cloud technologies. My goal is to develop
              practical solutions that help students and solve real-world
              problems.
            </p>

            <div className="skill-list">
              <span>Python</span>
              <span>React</span>
              <span>FastAPI</span>
              <span>AI</span>
              <span>RAG</span>
              <span>Google Cloud</span>
              <span>SQL</span>
            </div>

            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/shardul-mangrulkar"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/shardulMangrulkar13"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
