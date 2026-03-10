"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
import image from "@/assests/1.jpeg";

export default function HomeStorySection() {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <p className="text-orange-600 font-semibold mb-2">Event Platform</p>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Smart Event{" "}
            <span className="text-orange-600">Management & Registration</span>{" "}
            System
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            A modern web application that helps organizers create, manage, and
            track events effortlessly. From conferences and workshops to
            internal company meetups, the platform allows users to browse
            upcoming events, register online, and receive instant confirmation
            notifications.
          </p>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Organizers can manage registrations, monitor attendance, and
            generate insightful reports — all in one place. Designed to simplify
            event planning and improve the participant experience.
          </p>

          <Link href="/events">
            <Button className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 font-medium transition">
              Explore Events →
            </Button>
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-100 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={image}
            alt="Event Management Platform"
            fill
            className="object-cover"
          />

          {/* Overlay text */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-4 font-semibold text-lg">
            Manage Events. Track Registrations. Simplify Attendance.
          </div>
        </div>
      </div>
    </section>
  );
}
