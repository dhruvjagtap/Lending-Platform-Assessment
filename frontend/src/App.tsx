import { useState } from "react";

import "./App.css";

import Header from "./components/Header";
import LoanForm from "./components/LoanForm";
import Statistics from "./components/Statistics";

type Page = "form" | "statistics";

function App() {
  const [activePage, setActivePage] = useState<Page>("form");

  return (
    <div className="app">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {activePage === "form" && <LoanForm />}

        {activePage === "statistics" && <Statistics />}
      </main>
    </div>
  );
}

export default App;
