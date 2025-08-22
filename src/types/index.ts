export * from './wordpress';

export interface SwiperBreakpoints {
  [key: number]: {
    slidesPerView: number;
    spaceBetween: number;
  };
}

export interface CarouselProps {
  images: {
    id: string;
    sourceUrl: string;
    altText: string;
    title: string;
  }[];
  autoplay?: boolean;
  pagination?: boolean;
  navigation?: boolean;
  breakpoints?: SwiperBreakpoints;
}