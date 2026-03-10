import { Service } from "@/lib/mockService";

type Props = {
  service: Service;
};

export default function ServiceItem({ service }: Props) {
  const { Icon, title } = service;

  return (
    <li className="flex items-center space-x-3">
      <div className="flex items-center justify-center rounded-full bg-orange-600 p-2">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-gray-800">{title}</span>
    </li>
  );
}
