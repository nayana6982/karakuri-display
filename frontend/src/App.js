import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Templates from './components/template/Template';
import TemplatePage from './components/template/TemplatePage';
import NavBar from './components/navbar/NavBar';
import TopicPage from './components/topic/Topic';
import CreateNewTopic from './components/topic/CreateNewTopic';
import EditExistingTopic from './components/topic/EditExistingTopic';
import ManageTopics from './components/topic/ManageTopics';
import ScanPage from './components/scan/ScanPage';
import ViewPage from './components/scan/ViewPage';
import CreateNewPart from './components/topic/CreateNewPart';
import EditPart from './components/topic/EditPart';
import KarakuriApp from './components/karakuri/karakuriApp';

function AppContent() {
  const location = useLocation();

  // hide NavBar on homepage and Karakuri page
  const hideNavBar =
    location.pathname === '/' || location.pathname.startsWith('/karakuri');

  return (
    <>
      {!hideNavBar && <NavBar />}

      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Templates />} />

        {/* Company Portal pages */}
        <Route path="/company/*" element={<TemplatePage />} />
        <Route path="/view/:partId" element={<ViewPage />} />
        <Route path="/topic" element={<TopicPage />} />
        <Route path="/create-topic/new" element={<CreateNewTopic />} />
        <Route path="/create-topic/edit" element={<EditExistingTopic />} />
        <Route path="/part-list" element={<ManageTopics />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/part" element={<CreateNewPart />} />
        <Route path="/edit-part" element={<EditPart />} />

        {/* Karakuri Portal */}
        <Route path="/karakuri/*" element={<KarakuriApp />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;




