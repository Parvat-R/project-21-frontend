type Props = {
  title: string;
  links: string[];
};

export default function FooterColumn({ title, links }: Props) {
  return (
    <div>
      <h3 className="text-white font-semibold mb-4">{title}</h3>

      <ul className="space-y-2 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <a href="#" className="hover:text-orange-500 transition">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
