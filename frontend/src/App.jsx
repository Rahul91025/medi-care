import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { CircleChevronUp } from "lucide-react";

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import HomeDoctors from "./components/HomeDoctors/HomeDoctors";
import DoctorsPage from "./components/DoctorsPage/DoctorsPage";
import ServicePage from "./components/ServicePage/ServicePage";
import AppointmentPage from "./components/AppointmentPage/AppointmentPage";
import ContactPage from "./components/ContactPage/ContactPage";
import LoginPage from "./components/LoginPage/LoginPage";
import Certification from "./components/Certification/Certification";
import Testimonial from "./components/Testimonial/Testimonial";

// Pages
import DoctorDetail from "./pages/DoctorDetail/DoctorDetail";
import ServiceDetailPage from "./pages/ServiceDetailPage/ServiceDetailPage";
import AppointmentSuccess from "./pages/AppointmentSuccess/AppointmentSuccess";
import ServiceSuccess from "./pages/ServiceSuccess/ServiceSuccess";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-6 bottom-8 z-50 w-12 h-12 rounded-full flex items-center justify-center 
      bg-slate-900 text-white shadow-xl transition-all duration-500 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"} 
      hover:bg-primary-600 hover:scale-110 hover:shadow-2xl`}
      title="Go to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

// Home page with all sections
function HomePage() {
  return (
    <>
      <Hero />
      <HomeDoctors />
      <Certification />
      <ServicePage previewCount={4} />
      <Testimonial />
    </>
  );
}

export default function App() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/appointment/success" element={<AppointmentSuccess />} />
          <Route path="/service-appointment/success" element={<ServiceSuccess />} />
        </Routes>
      </main>
      <Footer />
      <ScrollButton />
    </div>
  );
}
