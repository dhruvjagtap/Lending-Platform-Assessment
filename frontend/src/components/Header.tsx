import "../sytyles/Header.css";

interface HeaderProps {
  activePage: "form" | "statistics";
  setActivePage: (page: "form" | "statistics") => void;
}

function Header({ activePage, setActivePage }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">Lending Platform</div>

      <nav className="navigation">
        <button
          className={activePage === "form" ? "active" : ""}
          onClick={() => setActivePage("form")}
        >
          Form
        </button>

        <button
          className={activePage === "statistics" ? "active" : ""}
          onClick={() => setActivePage("statistics")}
        >
          Statistics
        </button>
      </nav>
    </header>
  );
}

export default Header;
