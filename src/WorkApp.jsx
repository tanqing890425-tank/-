import Footer from './components/Footer'
import Header from './components/Header'
import WorkGallery from './components/WorkGallery'
import useReveal from './hooks/useReveal'

export default function WorkApp() {
  useReveal()

  return (
    <>
      <Header activePage="work" />
      <main>
        <WorkGallery />
      </main>
      <Footer />
    </>
  )
}
