import { BookingFlow } from '@/components/BookingFlow'
import { Experiences } from '@/components/Experiences'
import { Faq } from '@/components/Faq'
import { Features } from '@/components/Features'
import { FinalCta } from '@/components/FinalCta'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Notices } from '@/components/Notices'
import { StickyCta } from '@/components/StickyCta'

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Experiences />
        <Features />
        <BookingFlow />
        <Notices />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
