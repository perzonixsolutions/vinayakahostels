import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AvailabilityPage from './pages/AvailabilityPage'
import ContactPage from './pages/ContactPage'
import DiningPage from './pages/DiningPage'
import FacilitiesPage from './pages/FacilitiesPage'
import FAQsPage from './pages/FAQsPage'
import GalleryPage from './pages/GalleryPage'
import LocationPage from './pages/LocationPage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailPage from './pages/RoomDetailPage'
import RulesPage from './pages/RulesPage'
import TestimonialsPage from './pages/TestimonialsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLayout from './components/AdminLayout'
import AdminStudentsPage from './pages/admin/AdminStudentsPage'
import AdminAddStudentPage from './pages/admin/AdminAddStudentPage'
import AdminHostelsPage from './pages/admin/AdminHostelsPage'
import AdminBlockDetailPage from './pages/admin/AdminBlockDetailPage'
import AdminMenuPage from './pages/admin/AdminMenuPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'
import AdminGalleryPage from './pages/admin/AdminGalleryPage'

import { ScrollToTop } from './lib/scroll-to-top'

import MaintenanceRoute from './components/MaintenanceRoute'

function App() {

  return (
    <>
      <Router>
        <ScrollToTop />
        <MaintenanceRoute>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />

            {/* Admin Routes with Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="students/add" element={<AdminAddStudentPage />} />
              <Route path="hostels" element={<AdminHostelsPage />} />
              <Route path="hostels/block/:id" element={<AdminBlockDetailPage />} />
              <Route path="menu" element={<AdminMenuPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>
          </Routes>
        </MaintenanceRoute>
      </Router>
    </>
  )
}

export default App
