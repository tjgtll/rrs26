import React from 'react';
import type { Vehicle } from './types';
import { fetchVehicles } from './api/api';
import { Search } from './components/Search';
import { Results } from './components/Results';
import { Loader } from './components/Loader';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TestErrorButton } from './components/TestErrorButton';
import './App.css';

interface AppState {
  items: Vehicle[];
  loading: boolean;
  apiError: string | null;
  searchTerm: string;
  lastSearchedTerm: string;
}

const STORAGE_KEY = 'carSearchTerm';

export default class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      apiError: null,
      searchTerm: '',
      lastSearchedTerm: '',
    };
  }

  async componentDidMount() {
    const savedTerm = localStorage.getItem(STORAGE_KEY) || '';
    this.setState(
      { searchTerm: savedTerm, lastSearchedTerm: savedTerm },
      () => this.loadData(savedTerm)
    );
  }

  loadData = async (term: string) => {
    this.setState({ loading: true, apiError: null });
    try {
      const vehicles = await fetchVehicles(term);
      this.setState({ items: vehicles, loading: false });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      this.setState({ apiError: errorMsg, items: [], loading: false });
    }
  };

  handleSearch = (trimmedTerm: string) => {
    const { lastSearchedTerm } = this.state;
    if (trimmedTerm === lastSearchedTerm) return;
    localStorage.setItem(STORAGE_KEY, trimmedTerm);
    this.setState(
      { searchTerm: trimmedTerm, lastSearchedTerm: trimmedTerm },
      () => this.loadData(trimmedTerm)
    );
  };

  render() {
    const { items, loading, apiError, searchTerm } = this.state;
    return (
      <ErrorBoundary>
        <div>
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-card">
                <Search
                  initialSearchTerm={searchTerm}
                  onSearch={this.handleSearch}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>

          <div className="main-content">
            {loading ? <Loader /> : <Results items={items} error={apiError} />}
          </div>

          <div className="fixed-error-btn">
            <TestErrorButton />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}