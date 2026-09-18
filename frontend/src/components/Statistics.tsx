import { useEffect, useState } from "react";

import StatCard from "./StatCard";
import ApplicationList from "./ApplicationList";

import "../sytyles/Statistics.css";

interface Application {
  id: number;
  customerName: string;
  loanAmount: number;
  assetValue: number;
  creditScore: number;
  ltv: number;
  decision: string;
}

interface StatisticsData {
  totalApplicants: number;
  successfulApplicants: number;
  declinedApplicants: number;
  totalLoanValue: number;
  meanLtv: number;
}

interface DashboardResponse {
  statistics: StatisticsData;
  applications: Application[];
}

function Statistics() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [selectedSection, setSelectedSection] = useState<
    "all" | "success" | "rejected" | null
  >(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/Statistics/dashboard`,
        );

        if (!response.ok) {
          throw new Error("Unable to load statistics.");
        }

        const data: DashboardResponse = await response.json();

        setDashboard(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unable to connect to the backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const toggleSection = (section: "all" | "success" | "rejected") => {
    setSelectedSection(selectedSection === section ? null : section);
  };

  if (loading) {
    return (
      <section className="statistics-container">
        <h1>Statistics</h1>
        <p>Loading statistics...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="statistics-container">
        <h1>Statistics</h1>
        <div className="form-error">{error}</div>
      </section>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { statistics, applications } = dashboard;

  const successfulApplications = applications.filter(
    (application) => application.decision === "Successful",
  );

  const rejectedApplications = applications.filter(
    (application) => application.decision === "Declined",
  );

  return (
    <section className="statistics-container">
      <h1>Statistics</h1>

      {/* Statistics Cards */}

      <div className="stats-cards">
        <StatCard
          title="Mean LTV Ratio"
          value={`${statistics.meanLtv.toFixed(2)}%`}
        />

        <StatCard
          title="Total Loan Given"
          value={`£${statistics.totalLoanValue.toLocaleString("en-GB")}`}
        />
      </div>

      {/* All Applications */}
      <div
        className={`application-section ${
          selectedSection === "all" ? "selected" : ""
        }`}
      >
        <button className="section-header" onClick={() => toggleSection("all")}>
          <span>All Applications</span>
          <span>{statistics.totalApplicants}</span>
        </button>

        {selectedSection === "all" && (
          <ApplicationList applications={applications} />
        )}
      </div>

      {/* Successful Applications */}
      <div
        className={`application-section ${
          selectedSection === "success" ? "selected" : ""
        }`}
      >
        <button
          className="section-header"
          onClick={() => toggleSection("success")}
        >
          <span>Successful Applications</span>
          <span>{statistics.successfulApplicants}</span>
        </button>

        {selectedSection === "success" && (
          <ApplicationList applications={successfulApplications} />
        )}
      </div>

      {/* Rejected Applications */}
      <div
        className={`application-section ${
          selectedSection === "rejected" ? "selected" : ""
        }`}
      >
        <button
          className="section-header"
          onClick={() => toggleSection("rejected")}
        >
          <span>Rejected Applications</span>
          <span>{statistics.declinedApplicants}</span>
        </button>

        {selectedSection === "rejected" && (
          <ApplicationList applications={rejectedApplications} />
        )}
      </div>
    </section>
  );
}

export default Statistics;
