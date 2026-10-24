import React from 'react';
import TopNavbar from './components/TopNavbar';
import JiraHome from './pages/JiraHome';
import { AIProvider } from './context/AIContext';

function App() {
  return (
    <AIProvider>
      <div className="jira-app">
        <TopNavbar />
        <JiraHome />
      </div>
    </AIProvider>
  );
}

export default App;
