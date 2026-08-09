export const site = {
  name: 'ELSEWHERE',
  title: 'Elsewhere — Places, people, moments',
  description: 'An independent visual publication about places, people and the moments that remain.',
  statement: 'The world, as I remember it.',
  locale: 'en',
  defaultShareImage: '/social/home.jpg',
  defaultShareImageAlt: 'Volcanic ridges rising beneath immense sunlit clouds',
  navigation: [
    { label: 'Explore', href: '/archive/' },
    { label: 'People', href: '/people/' },
    { label: 'Stories', href: '/#story' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'About', href: '/#about' },
  ],
} as const;
