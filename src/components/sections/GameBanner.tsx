"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { BannerNode } from "@/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GameBannerProps {
  banners: BannerNode[];
}

export default function GameBanner({ banners }: GameBannerProps) {
  if (!banners || banners.length === 0) return null;
  return (
    <section className="relative h-48 sm:h-64 md:h-72 lg:h-80 mb-4 sm:mb-6 lg:mb-8 mx-4 sm:mx-6 lg:mx-8 mt-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="h-full w-full rounded-xl sm:rounded-2xl overflow-hidden"
      >
        {banners.map((banner, index) => {
          const imageNode = banner.featuredImage?.node;
          const imageUrl = imageNode?.sourceUrl || "";
          const alt = imageNode?.altText || banner.title;
          return (
            <SwiperSlide key={`${banner.title}-${index}`}>
              <div className="relative h-full w-full">
                <Image
                  src={imageUrl}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 lg:mb-4 drop-shadow-lg">
                    {banner.title}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Buttons - Hidden on mobile */}
      <button className="swiper-button-prev-custom hidden sm:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/50 hover:bg-black/70 rounded-full items-center justify-center text-white transition-all duration-300">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button className="swiper-button-next-custom hidden sm:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/50 hover:bg-black/70 rounded-full items-center justify-center text-white transition-all duration-300">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
