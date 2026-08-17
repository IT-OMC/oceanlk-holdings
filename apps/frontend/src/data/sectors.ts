export interface Sector {
  id: string
  title: string
  desc: string
  logo: string
  image: string
}

// Restored from the pre-migration design (git cf2cf2c) — represents the five
// operating subsidiaries shown in the homepage Hero carousel and the
// EcosystemAccordion section. Static assets referenced here (logos, hero
// images) already exist under public/company logos and public/company
// images for hero section.
export const sectors: Sector[] = [
  {
    id: 'omc',
    title: 'Ocean Maritime Ceylon',
    desc: 'Takes orders and delivers supplies for ships in operation side.',
    logo: '/company logos/Ocean Maritime Ceylon logo.png',
    image: '/company images for hero section/ocean maritime ceylon.jpg',
  },
  {
    id: 'oec',
    title: 'Ocean Engineering Ceylon',
    desc: 'The engineering company which completes the engineering requests of the company.',
    logo: '/company logos/Ocean engineering ceylon.png',
    image: '/company images for hero section/ocean engineering ceylon.jpg',
  },
  {
    id: 'omch',
    title: 'Ocean Maritime Channel',
    desc: 'Does the supply side, handling logistics and channel management.',
    logo: '/company logos/ocean maritime channel.png',
    image: '/company images for hero section/ocean maritime channels.jpg',
  },
  {
    id: 'connecting-cubes',
    title: 'Connecting Cubes',
    desc: 'A traveling agency creating personalized travel experiences.',
    logo: '/company logos/connecting cubes logo..png',
    image: '/company images for hero section/connecting cubes.jpg',
  },
  {
    id: 'digital-books',
    title: 'Digital Books',
    desc: 'A digital marketing company driving brand visibility.',
    logo: '/company logos/digital books.png',
    image: '/company images for hero section/digital books.jpg',
  },
]
