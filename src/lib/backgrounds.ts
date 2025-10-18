// Background images served from public folder
export const backgrounds = {
  home: '/backgrounds/welcomebackground.png',
  shop: '/backgrounds/background1.png',
  game: '/backgrounds/background2.png',
  checkout: '/backgrounds/background3.png',
  account: '/backgrounds/background4.png'
}

export type PageType = keyof typeof backgrounds