import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import PDFViewer from "./pages/PDFViewer";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/pdf/:filename"
              element={<PDFViewer />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;