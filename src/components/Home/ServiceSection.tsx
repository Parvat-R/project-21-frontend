import Image from "next/image";
import { services } from "@/lib/mockService";
import ServiceItem from "./ServiceItem";
import img from "@/assests/8.jpeg";

export default function ServicesSection() {
  // Split services array into two halves for two columns
  const half = Math.ceil(services.length / 2);
  const leftServices = services.slice(0, half);
  const rightServices = services.slice(half);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <div className="relative w-full md:w-1/2 h-100 rounded-lg overflow-hidden shadow-lg">
          <Image src={img} alt="Event Stage" fill className="object-cover" />
        </div>

        {/* Right content */}
        <div className="w-full md:w-1/2">
          <div className="text-center md:text-left mb-10">
            <p className="text-orange-600 font-medium">What We Do</p>
            <h2 className="text-3xl font-bold">
              Top{" "}
              <span className="text-orange-600">Event Planning Services</span>{" "}
              in Chennai
            </h2>
          </div>

          {/* Services list */}
          <div className="flex gap-8">
            <ul className="space-y-6 flex-1">
              {leftServices.map((service) => (
                <ServiceItem key={service.id} service={service} />
              ))}
            </ul>

            <ul className="space-y-6 flex-1">
              {rightServices.map((service) => (
                <ServiceItem key={service.id} service={service} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
