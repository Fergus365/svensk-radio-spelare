
import { HashRouter, Route, Routes } from "react-router";
import Header from "./components/Header";
import RadioPlayer from "./pages/RadioPlayer";
import Hem from "./pages/Hem";
import OmSvenskRadioSpelare from "./pages/OmSvenskRadioSpelare";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" Component={Hem}></Route>
          <Route path="/radioplayer" Component={RadioPlayer}></Route>
          <Route path="/om-svensk-radio-spelare" Component={OmSvenskRadioSpelare}></Route>
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;