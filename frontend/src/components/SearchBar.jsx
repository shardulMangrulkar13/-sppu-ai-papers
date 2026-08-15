import {
  Search,
  RotateCcw,
  GraduationCap,
  Calendar,
  FileText,
  BookOpen,
  CheckCircle,
} from "lucide-react";

import { useState } from "react";

export default function SearchBar({
  branches,
  years,
  patterns,
  subjects,
  filters,
  setFilters,
  onSearch,
}) {
  const [searching, setSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  function updateFilter(key, value) {
    const updated = {
      ...filters,
      [key]: value,
    };

    if (key === "branch") {
      updated.year = "";
      updated.pattern = "";
      updated.subject = "";
    }

    if (key === "year") {
      updated.pattern = "";
      updated.subject = "";
    }

    if (key === "pattern") {
      updated.subject = "";
    }

    setFilters(updated);

    // New filter means previous search is no longer current
    setSearchCompleted(false);
  }

  function resetFilters() {
    setFilters({
      branch: "",
      year: "",
      pattern: "",
      subject: "",
    });

    setSearchCompleted(false);
  }

  async function handleSearch() {
    if (
      !filters.branch ||
      !filters.year ||
      !filters.pattern ||
      !filters.subject
    ) {
      return;
    }

    setSearching(true);
    setSearchCompleted(false);

    try {
      await onSearch();

      setSearchCompleted(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchCompleted(false);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="search-box">
      <div className="search-header">
        <span className="search-badge">SPPU Question Paper Finder</span>

        <h2>Find Previous Year Question Papers</h2>

        <p>Select your Branch, Academic Year, Pattern and Subject.</p>
      </div>

      <div className="search-grid">
        {/* Branch */}

        <div className="input-group">
          <GraduationCap size={18} />

          <select
            value={filters.branch}
            onChange={(e) => updateFilter("branch", e.target.value)}
          >
            <option value="">Select Branch</option>

            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        {/* Academic Year */}

        <div className="input-group">
          <Calendar size={18} />

          <select
            value={filters.year}
            disabled={!filters.branch}
            onChange={(e) => updateFilter("year", e.target.value)}
          >
            <option value="">Academic Year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Pattern */}

        <div className="input-group">
          <FileText size={18} />

          <select
            value={filters.pattern}
            disabled={!filters.year}
            onChange={(e) => updateFilter("pattern", e.target.value)}
          >
            <option value="">Pattern</option>

            {patterns.map((pattern) => (
              <option key={pattern} value={pattern}>
                {pattern}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}

        <div className="input-group">
          <BookOpen size={18} />

          <select
            value={filters.subject}
            disabled={!filters.pattern}
            onChange={(e) => updateFilter("subject", e.target.value)}
          >
            <option value="">Subject</option>

            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-buttons">
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={
            searching ||
            !filters.branch ||
            !filters.year ||
            !filters.pattern ||
            !filters.subject
          }
        >
          {searching ? (
            <>
              <Search size={18} className="search-loading-icon" />
              Searching Papers...
            </>
          ) : searchCompleted ? (
            <>
              <CheckCircle size={18} />
              Search Completed
            </>
          ) : (
            <>
              <Search size={18} />
              Search Papers
            </>
          )}
        </button>

        <button
          className="reset-btn"
          onClick={resetFilters}
          disabled={searching}
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      {searching && (
        <div className="search-status searching-status">
          <Search size={18} />
          <span>Searching question papers...</span>
        </div>
      )}

      {searchCompleted && !searching && (
        <div className="search-status success-status">
          <CheckCircle size={18} />
          <span>Search completed successfully.</span>
        </div>
      )}
    </div>
  );
}
