import Header from "../components/Header";

export default function Page() {
    return (
        <main>
            <Header />
            <section id="about" className="h-screen flex items-center justify-center">
                <h1 className="text-4xl">About Section</h1>
            </section>
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