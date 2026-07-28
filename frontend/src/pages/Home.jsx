import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import SubjectCard from "../components/SubjectCard";
import StatsCard from "../components/statsCard";
import AIChat from "../components/AIChat";


const API = "http://127.0.0.1:8000";

export default function Home() {
  const [papers, setPapers] = useState([]);

  const [branches, setBranches] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);

  const [filters, setFilters] = useState({
    branch: "",
    pattern: "",
    subject: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    if (!filters.branch) {
      setPatterns([]);
      setSubjects([]);
      setYears([]);
      return;
    }
    loadPatterns(filters.branch);
  }, [filters.branch]);

  useEffect(() => {
    if (!filters.branch || !filters.pattern) {
      setSubjects([]);
      setYears([]);
      return;
    }
    loadSubjects(filters.branch, filters.pattern);
  }, [filters.branch, filters.pattern]);

  useEffect(() => {
    if (!filters.branch || !filters.pattern || !filters.subject) {
      setYears([]);
      return;
    }
    loadYears(filters.branch, filters.pattern, filters.subject);
  }, [filters.branch, filters.pattern, filters.subject]);

  async function loadBranches() {
    const res = await axios.get(`${API}/branches`);
    setBranches(res.data);
  }

  async function loadPatterns(branch) {
    const res = await axios.get(`${API}/patterns`, {
      params: { branch },
    });
    setPatterns(res.data);
  }

  async function loadSubjects(branch, pattern) {
    const res = await axios.get(`${API}/subjects`, {
      params: { branch, pattern },
    });
    setSubjects(res.data);
  }

  async function loadYears(branch, pattern, subject) {
    const res = await axios.get(`${API}/years`, {
      params: { branch, pattern, subject },
    });
    setYears(res.data);
  }

  async function handleSearch() {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/papers`, {
        params: filters,
      });

      setPapers(res.data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-left">

          <h1>🎓 SPPU AI Papers</h1>

          <p>
            Find, Preview & Download Previous Year Question Papers
            powered by Artificial Intelligence.
          </p>

          <SearchBar
            branches={branches}
            patterns={patterns}
            subjects={subjects}
            years={years}
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />

        </div>

        <div className="hero-right">
          <AIChat />
        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats-grid">

        <StatsCard
          title="Question Papers"
          value={papers.length}
        />

        <StatsCard
          title="Branches"
          value={branches.length}
        />

        <StatsCard
          title="Subjects"
          value={subjects.length}
        />

        <StatsCard
          title="AI Powered"
          value="Yes"
        />

      </section>

      {/* ================= SEARCH RESULTS ================= */}

      {searched && (
        <section className="papers-section" id="papers">

          <h2 className="section-title">
            Search Results ({papers.length})
          </h2>

          {loading ? (
            <div className="loading">
              <h3>Loading...</h3>
            </div>
          ) : papers.length === 0 ? (
            <div className="loading">
              <h3>No Question Papers Found</h3>
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
      )}

            {/* ================= ABOUT ================= */}

      <section className="about-section" id="about">

        <div className="section-header">
          <span className="section-tag">ABOUT PROJECT</span>
          <h2>SPPU AI Papers</h2>
          <p>
            An AI-powered academic platform built to help Savitribai Phule Pune
            University students find previous year question papers faster and
            prepare for exams more efficiently.
          </p>
        </div>

        <div className="about-grid">

          <div className="about-card">

            <h3>🎯 Our Mission</h3>

            <p>
              We aim to simplify exam preparation by providing a centralized
              platform where students can search, preview, download and study
              previous year question papers with the help of Artificial
              Intelligence.
            </p>

          </div>

          <div className="about-card">

            <h3>🚀 Features</h3>

            <ul>
              <li>AI Study Assistant</li>
              <li>Smart Question Paper Search</li>
              <li>PDF Preview</li>
              <li>Instant Download</li>
              <li>Branch & Subject Filters</li>
              <li>Responsive Design</li>
            </ul>

          </div>

          <div className="about-card">

            <h3>🛠 Tech Stack</h3>

            <div className="tech-stack">
              <span>React</span>
              <span>FastAPI</span>
              <span>Python</span>
              <span>RAG</span>
              <span>AI</span>
              <span>REST API</span>
            </div>

          </div>

        </div>

      </section>

      {/* ================= DEVELOPER ================= */}

      <section className="developer-section" id="developer">

        <div className="section-header">
          <span className="section-tag">DEVELOPER</span>
          <h2>Meet the Developer</h2>
          <p>
            Built with passion to make studying smarter for every SPPU student.
          </p>
        </div>

        <div className="developer-card">

          <div className="developer-avatar">
            <span>SM</span>
          </div>

          <div className="developer-content">

            <h2>Shardul Mangrulkar</h2>

            <h4>Full Stack Developer • AI Developer</h4>

            <p>
              I am an Electronics & Telecommunication Engineering student with a
              strong interest in Artificial Intelligence, Full Stack
              Development, and building practical software solutions. SPPU AI
              Papers was created to make previous year question papers easily
              accessible and provide AI-powered academic assistance for students.
            </p>

            <div className="skill-list">

              <span>Python</span>
              <span>FastAPI</span>
              <span>React</span>
              <span>JavaScript</span>
              <span>RAG</span>
              <span>REST API</span>
              <span>AI</span>

            </div>

            <div className="social-links">

              <a
                href="https://github.com/shardulMangrulkar13"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/shardul-mangrulkar"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}