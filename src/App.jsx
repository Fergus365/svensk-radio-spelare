
import { HashRouter, Route, Routes } from "react-router";
import Header from "./components/Header";
import RadioPlayer from "./pages/RadioPlayer";
import Hem from "./pages/Hem";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" Component={Hem}></Route>
          <Route path="/all-stations" Component={RadioPlayer}></Route>
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;