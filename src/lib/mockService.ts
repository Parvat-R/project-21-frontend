import {
  PresentationChartBarIcon,
  RocketLaunchIcon,
  TrophyIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  StarIcon,
  // MusicNoteIcon,
  AcademicCapIcon,
  // HandshakeIcon,
  UsersIcon,
  NewspaperIcon,
  GiftIcon,
  // SpeakerphoneIcon,
} from "@heroicons/react/24/outline";

export type Service = {
  id: number;
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const services: Service[] = [
  { id: 1, title: "Conferences & Seminars", Icon: PresentationChartBarIcon },
  { id: 2, title: "Product Launches", Icon: RocketLaunchIcon },
  { id: 3, title: "Award Ceremonies", Icon: TrophyIcon },
  { id: 4, title: "Team Building Events", Icon: UserGroupIcon },
  { id: 5, title: "Trade Shows & Exhibitions", Icon: ShoppingBagIcon },
  { id: 6, title: "Corporate Retreats", Icon: BriefcaseIcon },
  { id: 7, title: "Luxury Lifestyle Events", Icon: StarIcon },
  // { id: 8, title: "Live Concerts", Icon: MusicNoteIcon },
  {
    id: 9,
    title: "Corporate Training Programs & Workshops",
    Icon: AcademicCapIcon,
  },
  // { id: 10, title: "Channel Partner Meet", Icon: HandshakeIcon },
  { id: 11, title: "Dealer Meet", Icon: UsersIcon },
  { id: 12, title: "Conclaves", Icon: PresentationChartBarIcon },
  { id: 13, title: "Summits", Icon: PresentationChartBarIcon },
  { id: 14, title: "MICE Event Planning", Icon: BriefcaseIcon },
  { id: 15, title: "Annual General Meetings", Icon: UsersIcon },
  { id: 16, title: "Press Conferences & Media Events", Icon: NewspaperIcon },
  { id: 17, title: "Incentive Programs / Incentive Trips", Icon: GiftIcon },
  // {
  //   id: 18,
  //   title: "Brand Activations & Promotional Events",
  //   Icon: SpeakerphoneIcon,
  // },
];
