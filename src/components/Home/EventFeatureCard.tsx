import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
};

export default function EventFeatureCard({ title, description, icon }: Props) {
  return (
    <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-zinc-800">
      <div className="text-orange-500 mb-3">{icon}</div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
