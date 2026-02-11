import Header from "../components/Header";
import HeroScreen from "../Sections/HeroScreen";

export default function Page() {
    return (
        <main>
            <Header />
            <HeroScreen />
            <section id="skills" className="h-screen flex items-center justify-center">
                <h1 className="text-4xl">Skills Section</h1>
            </section>
            <section id="projects" className="h-screen flex items-center justify-center">
                <h1 className="text-4xl">Projects Section</h1>
            </section>
            <section id="experience" className="h-screen flex items-center justify-center">
                <h1 className="text-4xl">Experience Section</h1>
            </section>
        </main>
    );
}