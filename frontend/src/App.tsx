import AppRoutes from "./routes";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
