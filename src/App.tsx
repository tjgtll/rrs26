import { Routes, Route, Link } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { Details } from './pages/Details';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TestErrorButton } from './components/TestErrorButton';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <nav className="navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>

        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="details/:id" element={<Details />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <div className="fixed-error-btn">
          <TestErrorButton />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;