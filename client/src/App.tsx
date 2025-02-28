import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { EntryForm } from './pages/EntryForm';
import { EntryList } from './pages/EntryList';
import { NotFound } from './pages/NotFound';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<EntryList />} />
        <Route path="details/:entryId" element={<EntryForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
