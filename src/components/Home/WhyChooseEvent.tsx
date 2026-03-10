import { features } from "@/lib/mockwhyChooseData";

export default function WhyChooseEventSystem() {
  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Why Use Our Event Management System?
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            A powerful platform for organizing, managing, and analyzing events.
            From registration to attendance tracking — everything in one place.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-orange-500/40">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="border border-orange-500/40 p-8 flex flex-col items-center text-center hover:bg-zinc-900 transition"
            >
              {/* <div className="text-orange-500 mb-4">{feature.icon}</div> */}

              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
