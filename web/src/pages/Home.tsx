import { Capabilities } from '../components/Capabilities'
import { Hero } from '../components/Hero'
import { Intelligence } from '../components/Intelligence'
import { Journey } from '../components/Journey'
import { Trust } from '../components/Trust'
import { Why } from '../components/Why'

export function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Why />
      <Capabilities />
      <Intelligence />
      <Journey />
    </>
  )
}
