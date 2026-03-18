// pages/Home.tsx
import PatientHeroPage from "../../components/hero/patientHeroPage";
import AboutUs from "../../sections/Home/AboutUs";
import OurServices from "../../sections/Home/OurServices";
import OurDoctors from "../../sections/Home/OurDoctors";
import ProgramsAchievements from "../../sections/Home/ProgramsAchievements";
import HowWeWork from "../../sections/Home/HowWeWork";
import Testimonials from "../../sections/Home/Testimonials";
const Home = () => {
  return (
    <div className="min-h-screen">
      <PatientHeroPage />
      <AboutUs />
      <OurServices />
      <OurDoctors />
      <ProgramsAchievements />
      <HowWeWork />
      <Testimonials />
    </div>
  );
};

export default Home;
