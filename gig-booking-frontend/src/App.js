import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import AppRouter from "./router/AppRouter.jsx";

// Global styles
import "./styles/globals.css";
import "./styles/animations.css";
import "./styles/form.css";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRouter />
      </Router>
    </AppProvider>
  );
}
