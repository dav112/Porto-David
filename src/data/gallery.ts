export type Artwork = {
  thumb: string;
  src: string;
  alt: string;
  w: number;
  h: number;
  rotate: number;
};

export const artworks: Artwork[] = [
  { thumb: "/gallery/thumb-01.webp", src: "/gallery/full/full-01.webp", alt: "Concept artwork", w: 2400, h: 1600, rotate: 1.5 },
  { thumb: "/gallery/thumb-02.webp", src: "/gallery/full/full-02.webp", alt: "Halia coklat poster", w: 1780, h: 2400, rotate: -1 },
  { thumb: "/gallery/thumb-03.webp", src: "/gallery/full/full-03.webp", alt: "Halia susu butterscotch poster", w: 1696, h: 2400, rotate: 1.2 },
  { thumb: "/gallery/thumb-04.webp", src: "/gallery/full/full-04.webp", alt: "Lovure artwork", w: 2400, h: 1697, rotate: -1.6 },
  { thumb: "/gallery/thumb-05.webp", src: "/gallery/full/full-05.webp", alt: "Markisa oais poster", w: 1779, h: 2400, rotate: 0.8 },
  { thumb: "/gallery/thumb-06.webp", src: "/gallery/full/full-06.webp", alt: "Promo es dino banner", w: 1800, h: 2400, rotate: -0.8 },
  { thumb: "/gallery/thumb-07.webp", src: "/gallery/full/full-07.webp", alt: "Warkop Tjahaja Abadi new menu alert", w: 1920, h: 2400, rotate: 1.8 },
  { thumb: "/gallery/thumb-08.webp", src: "/gallery/full/full-08.webp", alt: "Warkop Tjahaja Abadi grand opening", w: 1919, h: 2400, rotate: -1.3 },
  { thumb: "/gallery/thumb-09.webp", src: "/gallery/full/full-09.webp", alt: "Flayer poster", w: 1696, h: 2400, rotate: 1 },
  { thumb: "/gallery/thumb-10.webp", src: "/gallery/full/full-10.webp", alt: "Informasi poster", w: 1350, h: 2400, rotate: -1.5 },
  { thumb: "/gallery/thumb-11.webp", src: "/gallery/full/full-11.webp", alt: "Sakura aon poster", w: 1563, h: 2400, rotate: 0.6 },
];