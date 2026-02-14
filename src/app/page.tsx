import Footer from "../components/Footer";
import Header from "../components/Header";
import ExperienceSection from "../Sections/ExperienceSection";
import HeroScreen from "../Sections/HeroScreen";
import ProjectsSection from "../Sections/ProjectsSection";
import SkillsSection from "../Sections/Skills";

export default function Page() {
    return (
        <main>
            <Header />
            <HeroScreen />
            <SkillsSection />
            <ProjectsSection />
            <ExperienceSection />
            <Footer />
        </main>
    );
}