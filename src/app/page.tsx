import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, BarChart3, ShieldCheck, Ticket, Zap } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              JEVENT 2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground">
              Manage events with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                absolute precision.
              </span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground mb-10">
              The all-in-one modern platform for organisers to create, manage, and scale events, while giving attendees a seamless registration experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full">
                <Link href="/signin">Sign In to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful tools designed specifically for modern event organisers. Stop juggling spreadsheets and start scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Calendar, title: "Effortless Scheduling", desc: "Create and publish events in minutes with our intuitive builder." },
                { icon: Users, title: "Attendee Management", desc: "Track registrations, manage capacity, and check-in attendees seamlessly." },
                { icon: Ticket, title: "Ticketing & Payments", desc: "Process free or paid registrations securely with instant ticketing." },
                { icon: BarChart3, title: "Real-time Analytics", desc: "Get actionable insights with live dashboards and attendance records." },
                { icon: ShieldCheck, title: "Role-based Access", desc: "Secure environments for Admins, Organisers, and regular Attendees." },
                { icon: Zap, title: "Lightning Fast", desc: "Built on modern web technologies ensuring a blazing fast experience." },
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to host your next big event?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of organisers who trust JEVENT to power their experiences. Setup takes less than 2 minutes.
            </p>
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl">
              <Link href="/signup">
                Create Your Free Account
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <div className="text-2xl font-extrabold tracking-tighter mb-4 text-foreground/80">JEVENT.</div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} JEVENT Inc. All rights reserved. <br/>
            Designed with Shadcn UI & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
