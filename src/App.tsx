import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MonthBalance } from './pages/MonthBalance';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MonthBalance/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;