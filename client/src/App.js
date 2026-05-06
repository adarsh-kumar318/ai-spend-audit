import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuditReport from "./pages/AuditReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit/:id" element={<AuditReport />} />
      </Routes>
    </Router>
  );
}

export default App;
