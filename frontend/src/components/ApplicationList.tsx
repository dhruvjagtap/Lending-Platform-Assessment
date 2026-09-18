import "../sytyles/ApplicationList.css";

interface Application {
  id: number;
  customerName: string;
  loanAmount: number;
  assetValue: number;
  creditScore: number;
  ltv: number;
  decision: string;
}

interface ApplicationListProps {
  applications: Application[];
}

function ApplicationList({ applications }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="application-list empty-list">
        <p>No applications found.</p>
      </div>
    );
  }

  return (
    <div className="application-list">
      {applications.map((application) => (
        <div className="application-row" key={application.id}>
          <div className="application-name">
            <strong>{application.customerName}</strong>
          </div>

          <div>Loan: £{application.loanAmount.toLocaleString("en-GB")}</div>

          <div>Assets: £{application.assetValue.toLocaleString("en-GB")}</div>

          <div>LTV: {application.ltv.toFixed(2)}%</div>

          <div>Score: {application.creditScore}</div>
        </div>
      ))}
    </div>
  );
}

export default ApplicationList;
