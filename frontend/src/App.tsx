import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from './store';
import { theme } from './styles/theme';
import Layout from './components/Layout/Layout';
import { Home } from './pages/Home';
import { WorkspaceList } from './components/Workspace/WorkspaceList';
import { WorkspaceDetail } from './components/Workspace/WorkspaceDetail';
import { CreateWorkspace } from './components/Workspace/CreateWorkspace';
import { WorkspaceMembers } from './components/Workspace/WorkspaceMembers';
import { WorkspaceSettings } from './components/Workspace/WorkspaceSettings';
import { JoinWorkspace } from './pages/Workspace/JoinWorkspace';
import BoardPage from './pages/Board/BoardPage';
import AccountPage from './components/Account/AccountPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/workspaces"
              element={
                <Layout>
                  <WorkspaceList />
                </Layout>
              }
            />
            <Route
              path="/workspace/:workspaceId"
              element={
                <Layout>
                  <WorkspaceDetail />
                </Layout>
              }
            />
            <Route
              path="/workspaces/create"
              element={
                <Layout>
                  <CreateWorkspace />
                </Layout>
              }
            />
            <Route
              path="/workspaces/:workspaceId/members"
              element={
                <Layout>
                  <WorkspaceMembers />
                </Layout>
              }
            />
            <Route
              path="/workspaces/:workspaceId/settings"
              element={
                <Layout>
                  <WorkspaceSettings />
                </Layout>
              }
            />
            <Route path="/workspaces/:workspaceId/join" element={<JoinWorkspace />} />
            <Route
              path="/boards/:boardId"
              element={
                <Layout>
                  <BoardPage />
                </Layout>
              }
            />
            <Route
              path="/compte"
              element={
                <Layout>
                  <AccountPage />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
