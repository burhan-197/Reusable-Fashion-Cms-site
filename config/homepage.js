module.exports = Object.freeze({
  hero: {
    enabled: true,
    eyebrow: 'The New Perspective · Collection 01',
    titleLine1: 'A wardrobe.',
    titleLine2Before: 'A',
    titleHighlight: 'point of view.',
    descriptionLine1: 'Good pieces. Great possibilities.',
    descriptionLine2: 'Meet your everyday, reimagined.',
    buttonText: 'Discover the collection',
    buttonUrl: '/products',
    captionLeft: 'The Everyday Edit',
    captionRight: 'New Season · No. 01',
    image: '/images/forme/hero.webp',
    imageAlt: 'Two models in relaxed monochrome tailoring',
    imagePosition: 'center center'
  },
  brandLine: { enabled: true, text: 'Less noise. More expression.', linkText: 'This is FORME', linkUrl: '#our-story' },
  collections: {
    enabled: true,
    headingLine1: 'Different moods.',
    headingLine2Before: 'Always',
    headingHighlight: 'you.',
    descriptionLine1: 'From the first coffee to the last plans.',
    descriptionLine2: 'Pieces for every version of your day.',
    cards: [
      { title: 'Everyday Elevated', description: 'A fresh take on the familiar.', linkUrl: '/products', image: '/images/forme/editorial.webp', imageAlt: 'A fluid black dress styled with understated accessories', imagePosition: 'center 35%' },
      { title: 'A Little Structure', description: 'Tailoring with room to breathe.', linkUrl: '/products', image: '/images/forme/jacket.webp', imageAlt: 'A softly structured stone jacket with relaxed tailoring', imagePosition: 'center 30%' },
      { title: 'Off-Duty Essentials', description: 'Ease into your own rhythm.', linkUrl: '/products', image: '/images/forme/knit.webp', imageAlt: 'A relaxed chocolate crewneck knit styled for everyday wear', imagePosition: 'center 30%' }
    ]
  },
  newArrivals: { enabled: true, eyebrow: 'The latest chapter', headingBefore: 'Just', headingHighlight: 'arrived', linkText: 'More to discover', linkUrl: '/products' },
  editorial: {
    enabled: true,
    eyebrow: 'The FORME Edit · 01',
    headingLine1: 'An art',
    headingLine2Before: 'of',
    headingHighlight: 'everyday',
    body: 'There’s something in the way a good piece moves with you. Familiar enough to live in, considered enough to feel like your own.',
    linkText: 'Find your everyday pieces',
    linkUrl: '/products',
    indexText: 'A different kind of uniform',
    image: '/images/forme/editorial.webp',
    imageAlt: 'Relaxed linen tailoring in a sunlit architectural setting',
    imagePosition: 'center 45%'
  },
  campaign: {
    enabled: true,
    eyebrow: 'One collection. Endless possibilities.',
    headingBefore: 'Wear it',
    headingHighlight: 'your way',
    descriptionLine1: 'Dress it up. Take it slow.',
    descriptionLine2: 'The best things in your wardrobe do both.',
    buttonText: 'Meet the essentials',
    buttonUrl: '/products',
    image: '/images/forme/hero.webp',
    imageAlt: 'Two models in relaxed linen looks in a sunlit architectural setting',
    imagePosition: 'center 55%'
  },
  bestSellers: { enabled: true, eyebrow: 'On repeat for a reason', headingBefore: 'The most', headingHighlight: 'wanted', descriptionLine1: 'The pieces you’ll reach for', descriptionLine2: 'again and again.' },
  brandStory: {
    enabled: true,
    mark: 'F',
    note: 'Considered clothing. Individual expression.',
    eyebrow: 'The way we see it',
    headingLine1: 'Style is personal.',
    headingLine2Before: 'Keep it',
    headingHighlight: 'that way.',
    body: 'FORME begins with a simple idea: your wardrobe should make space for who you are, not tell you who to be.'
  }
});
