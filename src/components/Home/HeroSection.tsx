"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn button

const images: string[] = [
  "https://www.chennaieventmanagementservice.com/assets/images/bg/event-management-company.webp",
  "https://www.mbatuts.com/wp-content/uploads/2019/11/Event-Planning-Business-in-plan-672x420.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS45D5iDUr-VqNBq-zuA4WJzNNfJMS7GXcQNOJHlQExBUrMSzWlNTklBaw&s",
];

export default function HeroSection() {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Background Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Manage Events Effortlessly
        </h1>

        <p className="text-lg md:text-xl max-w-2xl">
          A complete platform to create events, manage registrations, track
          attendance, and generate insightful reports — all in one place.
        </p>

        <Button variant="default" className="mt-6 px-6 py-3 font-semibold">
          Get Started
        </Button>
      </div>
    </section>
  );
}
