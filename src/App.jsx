import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import SelectedProjects from './components/SelectedProjects'
import useReveal from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Header activePage="about" />
      <main>
        <Hero />
        <Experience />
        <SelectedProjects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
