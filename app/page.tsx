import Hero from "./Components/homecomponent/Hero"
import Banner from "./Components/homecomponent/Banner"
import About from "./Components/homecomponent/About"
import Services from "./Components/homecomponent/Services"
export default function Home() {
    return (
        <main className="bg-fixed">
            <Hero />
            <Banner />
            <About />
            <Services/>
        </main>
    )
}