import { Search, RotateCcw } from "lucide-react";

export default function SearchBar({
  branches,
  patterns,
  subjects,
  years,
  filters,
  setFilters,
  onSearch,
}) {

  const updateFilter = (key, value) => {
    let updated = {
      ...filters,
      [key]: value,
    };

    // Reset dependent dropdowns
    if (key === "branch") {
      updated.pattern = "";
      updated.subject = "";
      updated.year = "";
    }

    if (key === "pattern") {
      updated.subject = "";
      updated.year = "";
    }

    if (key === "subject") {
      updated.year = "";
    }

    setFilters(updated);
  };

  const resetFilters = () => {
    setFilters({
      branch: "",
      pattern: "",
      subject: "",
      year: "",
    });
  };

  return (
    <div className="search-box">

      <h2 className="search-title">
        🔍 Find Previous Year Question Papers
      </h2>

      <div className="search-grid">

        {/* Branch */}

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

        {/* Pattern */}

        <select
          value={filters.pattern}
          disabled={!filters.branch}
          onChange={(e) => updateFilter("pattern", e.target.value)}
        >
          <option value="">Select Pattern</option>

          {patterns.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern}
            </option>
          ))}
        </select>

        {/* Subject */}

        <select
          value={filters.subject}
          disabled={!filters.pattern}
          onChange={(e) => updateFilter("subject", e.target.value)}
        >
          <option value="">Select Subject</option>

          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        {/* Year (Optional) */}

        <select
          value={filters.year}
          disabled={!filters.subject}
          onChange={(e) => updateFilter("year", e.target.value)}
        >
          <option value="">All Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

      </div>

      <div className="search-buttons">

        <button
          className="search-btn"
          onClick={onSearch}
          disabled={
            !filters.branch ||
            !filters.pattern ||
            !filters.subject
          }
        >
          <Search size={18} />
          Search Papers
        </button>

        <button
          className="reset-btn"
          onClick={resetFilters}
        >
          <RotateCcw size={18} />
          Reset
        </button>

      </div>

    </div>
  );
}