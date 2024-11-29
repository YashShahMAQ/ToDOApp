import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import ListsPage from './Pages/ListsPage';
import TasksPage from './Pages/TasksPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/tasks/:listId" element={<TasksPage />} />

          <Route path="*" element={<div>Page Not Found</div>} />

        </Routes>
      </div>
    </Router>
  );
}
export default App;
