import { footerLinks } from "@/lib/mockFooter";
import FooterColumn from "./FooterColumn";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-white mb-4">
            Event<span className="text-orange-500">Hub</span>
          </h2>

          <p className="text-sm leading-relaxed mb-6">
            A powerful event management and registration platform designed to
            simplify event creation, attendee management, ticketing, and
            analytics for organizers and participants.
          </p>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Phone size={16} /> +91 9876543210
            </p>

            <p className="flex items-center gap-2">
              <Mail size={16} /> support@jevent.com
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={16} /> Chennai, India
            </p>
          </div>
        </div>

        {/* Platform Links */}
        <FooterColumn title="Platform" links={footerLinks.platform} />

        {/* Organizer Tools */}
        <FooterColumn title="For Organizers" links={footerLinks.organizers} />

        {/* Support */}
        <FooterColumn title="Support" links={footerLinks.support} />
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800 py-6 text-center text-sm">
        © {new Date().getFullYear()} JEVENT. All rights reserved.
      </div>
    </footer>
  );
}
