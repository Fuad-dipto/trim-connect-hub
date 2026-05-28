export type Barber = {
  id: string;
  name: string;
  designation: string;
  experience: string;
  skills: string[];
  status: "free" | "busy" | "offline";
  rating: number;
  avatarHue: number;
  services: Service[];
  photo?: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number; // taka
};

export type Salon = {
  id: string;
  name: string;
  area: string;
  distance: number; // km
  rating: number;
  reviewCount: number;
  priceMin: number;
  priceMax: number;
  isOpen: boolean;
  crowd: "low" | "medium" | "high";
  tag: "low" | "medium" | "premium";
  description: string;
  hours: string;
  hue: number;
  barbers: Barber[];
  gallery: number[]; // hues for gradient placeholders
  photos?: string[];
  cover?: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  weeklyHours: { day: string; open: string; closed?: boolean }[];
  reviews: Review[];
};

export type Review = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
};

const svc = (id: string, name: string, description: string, duration: number, price: number): Service => ({
  id, name, description, duration, price,
});

const baseServices: Service[] = [
  svc("s1", "Classic Haircut", "Wash, cut and style", 30, 350),
  svc("s2", "Beard Trim & Shape", "Hot towel + precise trim", 20, 200),
  svc("s3", "Hair Color", "Premium color treatment", 75, 1500),
  svc("s4", "Facial Glow", "Deep cleansing facial", 45, 900),
  svc("s5", "Kids Cut", "Gentle cut for kids", 20, 180),
  svc("s6", "Royal Shave", "Straight razor experience", 30, 450),
];

const mkBarber = (
  id: string, name: string, designation: string, experience: string,
  skills: string[], status: Barber["status"], rating: number, hue: number,
  services: Service[], photo?: string,
): Barber => ({ id, name, designation, experience, skills, status, rating, avatarHue: hue, services, photo });

// Unsplash dummy assets
const U = (id: string, w = 400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const barberPhotos = [
  U("photo-1599351431202-1e0f0137899a"), // barber 1
  U("photo-1622286342621-4bd786c2447c"), // barber 2
  U("photo-1605497788044-5a32c7078486"), // barber 3
  U("photo-1583195764036-6dc248ac07d9"), // barber 4
  U("photo-1500648767791-00dcc994a43e"), // m1
  U("photo-1508214751196-bcfd4ca60f91"), // m2
  U("photo-1519085360753-af0119f7cbe7"), // m3
  U("photo-1492562080023-ab3db95bfbce"), // m4
  U("photo-1607990281513-2c110a25bd8c"), // f1
  U("photo-1580489944761-15a19d654956"), // f2
];

const salonPhotos1 = [U("photo-1521590832167-7bcbfaa6381f", 800), U("photo-1503951914875-452162b0f3f1", 800), U("photo-1622286342621-4bd786c2447c", 800), U("photo-1585747860715-2ba37e788b70", 800)];
const salonPhotos2 = [U("photo-1503951914875-452162b0f3f1", 800), U("photo-1599351431202-1e0f0137899a", 800), U("photo-1493256338651-d82f7acb2b38", 800), U("photo-1535930891776-0c2dfb7fda1a", 800)];
const salonPhotos3 = [U("photo-1532710093739-9470acff878f", 800), U("photo-1521490214180-77af1057d738", 800), U("photo-1622287162716-f311baa1a2b8", 800), U("photo-1622286346003-c5c7e63b1088", 800)];

const defaultHours = [
  { day: "Mon", open: "10:00 AM — 10:00 PM" },
  { day: "Tue", open: "10:00 AM — 10:00 PM" },
  { day: "Wed", open: "10:00 AM — 10:00 PM" },
  { day: "Thu", open: "10:00 AM — 10:00 PM" },
  { day: "Fri", open: "10:00 AM — 11:00 PM" },
  { day: "Sat", open: "9:00 AM — 11:00 PM" },
  { day: "Sun", open: "Closed", closed: true },
];

const sampleReviews = (seed: number): Review[] => [
  { id: `r${seed}1`, name: "Anika Rahman", avatar: U("photo-1494790108377-be9c29b29330"), rating: 5, date: "2 days ago", text: "Absolutely loved the experience. Rohim gave me the cleanest fade I've had in years. Highly recommend!" },
  { id: `r${seed}2`, name: "Mahin Khan", avatar: U("photo-1535713875002-d1d0cf377fde"), rating: 5, date: "1 week ago", text: "Premium vibe, super hygienic and the chai while waiting was a nice touch. Booking via the app was effortless." },
  { id: `r${seed}3`, name: "Sumaiya Islam", avatar: U("photo-1438761681033-6461ffad8d80"), rating: 4, date: "2 weeks ago", text: "Color came out beautiful. Took slightly longer than promised but worth it." },
  { id: `r${seed}4`, name: "Rafsan Ahmed", avatar: U("photo-1500648767791-00dcc994a43e"), rating: 5, date: "3 weeks ago", text: "Best barbershop in Dhaka, hands down. Already booked my next slot." },
];

export const salons: Salon[] = [
  {
    id: "luxe-cuts",
    name: "Luxe Cuts Studio",
    area: "Gulshan 2",
    distance: 0.8,
    rating: 4.9,
    reviewCount: 412,
    priceMin: 350,
    priceMax: 1800,
    isOpen: true,
    crowd: "medium",
    tag: "premium",
    description: "Award-winning hair studio with senior stylists trained in London. Premium experience in the heart of Gulshan.",
    hours: "10:00 AM — 10:00 PM",
    hue: 285,
    gallery: [285, 260, 310, 200],
    photos: salonPhotos1,
    cover: salonPhotos1[0],
    lat: 23.7925, lng: 90.4078,
    address: "House 42, Road 11, Gulshan 2, Dhaka",
    phone: "+880 1700-111222",
    weeklyHours: defaultHours,
    reviews: sampleReviews(1),
    barbers: [
      mkBarber("b1", "Rohim Ahmed", "Senior Stylist", "8 yrs", ["Fade", "Color", "Beard"], "free", 4.9, 285, baseServices, barberPhotos[0]),
      mkBarber("b2", "Karim Hossain", "Master Barber", "12 yrs", ["Classic", "Shave"], "busy", 4.8, 200, baseServices, barberPhotos[1]),
      mkBarber("b3", "Sharif Islam", "Stylist", "4 yrs", ["Modern", "Kids"], "free", 4.7, 320, baseServices, barberPhotos[2]),
      mkBarber("b4", "Niloy Khan", "Color Specialist", "6 yrs", ["Color", "Highlights"], "free", 4.9, 30, baseServices, barberPhotos[3]),
    ],
  },
  {
    id: "barber-bros",
    name: "Barber Bros",
    area: "Banani",
    distance: 1.4,
    rating: 4.7,
    reviewCount: 289,
    priceMin: 200,
    priceMax: 900,
    isOpen: true,
    crowd: "high",
    tag: "medium",
    description: "Old-school barbershop vibe with modern hygiene. Quick service, no nonsense.",
    hours: "9:00 AM — 11:00 PM",
    hue: 200,
    gallery: [200, 220, 180, 240],
    photos: salonPhotos2,
    cover: salonPhotos2[0],
    lat: 23.7937, lng: 90.4066,
    address: "Block C, Road 11, Banani, Dhaka",
    phone: "+880 1700-222333",
    weeklyHours: defaultHours,
    reviews: sampleReviews(2),
    barbers: [
      mkBarber("b5", "Tareq Mahmud", "Senior Barber", "10 yrs", ["Fade", "Shave"], "busy", 4.8, 200, baseServices, barberPhotos[4]),
      mkBarber("b6", "Joy Roy", "Barber", "3 yrs", ["Classic"], "free", 4.6, 230, baseServices, barberPhotos[5]),
      mkBarber("b7", "Imran Sheikh", "Barber", "5 yrs", ["Modern"], "offline", 4.5, 180, baseServices, barberPhotos[6]),
    ],
  },
  {
    id: "quick-trim",
    name: "QuickTrim Express",
    area: "Dhanmondi 27",
    distance: 2.1,
    rating: 4.4,
    reviewCount: 156,
    priceMin: 100,
    priceMax: 450,
    isOpen: true,
    crowd: "low",
    tag: "low",
    description: "Budget-friendly, no-wait cuts. Perfect for the morning rush.",
    hours: "8:00 AM — 9:00 PM",
    hue: 140,
    gallery: [140, 120, 160, 100],
    photos: salonPhotos3,
    cover: salonPhotos3[0],
    lat: 23.7460, lng: 90.3742,
    address: "Road 27, Dhanmondi, Dhaka",
    phone: "+880 1700-333444",
    weeklyHours: defaultHours,
    reviews: sampleReviews(3),
    barbers: [
      mkBarber("b8", "Sumon Ali", "Barber", "2 yrs", ["Classic"], "free", 4.3, 140, baseServices.slice(0, 3), barberPhotos[7]),
      mkBarber("b9", "Rafi Uddin", "Barber", "4 yrs", ["Quick"], "free", 4.5, 160, baseServices.slice(0, 3), barberPhotos[0]),
      mkBarber("b10", "Mizan Rahman", "Barber", "3 yrs", ["Kids"], "busy", 4.2, 120, baseServices.slice(0, 3), barberPhotos[1]),
    ],
  },
  {
    id: "glamour-house",
    name: "Glamour House",
    area: "Bashundhara R/A",
    distance: 3.0,
    rating: 4.8,
    reviewCount: 521,
    priceMin: 500,
    priceMax: 2000,
    isOpen: false,
    crowd: "low",
    tag: "premium",
    description: "Unisex luxury salon featuring imported products and signature treatments.",
    hours: "11:00 AM — 9:00 PM",
    hue: 340,
    gallery: [340, 300, 20, 280],
    photos: salonPhotos1,
    cover: salonPhotos1[1],
    lat: 23.8203, lng: 90.4250,
    address: "Block J, Bashundhara R/A, Dhaka",
    phone: "+880 1700-444555",
    weeklyHours: defaultHours,
    reviews: sampleReviews(4),
    barbers: [
      mkBarber("b11", "Nadia Akter", "Lead Stylist", "9 yrs", ["Color", "Bridal"], "offline", 4.9, 340, baseServices, barberPhotos[8]),
      mkBarber("b12", "Sabbir Hasan", "Senior Stylist", "7 yrs", ["Fade", "Beard"], "offline", 4.8, 300, baseServices, barberPhotos[2]),
      mkBarber("b13", "Tasnim Jahan", "Color Expert", "5 yrs", ["Color"], "offline", 4.7, 20, baseServices, barberPhotos[9]),
    ],
  },
  {
    id: "urban-edge",
    name: "Urban Edge Barbers",
    area: "Uttara Sec 4",
    distance: 4.2,
    rating: 4.6,
    reviewCount: 198,
    priceMin: 250,
    priceMax: 1200,
    isOpen: true,
    crowd: "medium",
    tag: "medium",
    description: "Streetwear-inspired barbershop with skilled fade artists.",
    hours: "10:00 AM — 10:30 PM",
    hue: 25,
    gallery: [25, 50, 10, 5],
    photos: salonPhotos2,
    cover: salonPhotos2[1],
    lat: 23.8741, lng: 90.3984,
    address: "Sector 4, Uttara, Dhaka",
    phone: "+880 1700-555666",
    weeklyHours: defaultHours,
    reviews: sampleReviews(5),
    barbers: [
      mkBarber("b14", "Hasib Karim", "Fade Artist", "6 yrs", ["Fade", "Design"], "free", 4.9, 25, baseServices, barberPhotos[3]),
      mkBarber("b15", "Tanvir Alam", "Barber", "4 yrs", ["Classic"], "free", 4.6, 50, baseServices, barberPhotos[4]),
      mkBarber("b16", "Riaz Mia", "Junior", "2 yrs", ["Beard"], "busy", 4.4, 10, baseServices, barberPhotos[5]),
    ],
  },
  {
    id: "rose-petal",
    name: "Rose Petal Salon",
    area: "Mirpur DOHS",
    distance: 5.5,
    rating: 4.5,
    reviewCount: 142,
    priceMin: 300,
    priceMax: 1500,
    isOpen: true,
    crowd: "low",
    tag: "medium",
    description: "Family-friendly salon with services for all ages.",
    hours: "9:00 AM — 9:00 PM",
    hue: 350,
    gallery: [350, 330, 10, 290],
    photos: salonPhotos3,
    cover: salonPhotos3[1],
    lat: 23.8061, lng: 90.3661,
    address: "Mirpur DOHS, Avenue 5, Dhaka",
    phone: "+880 1700-666777",
    weeklyHours: defaultHours,
    reviews: sampleReviews(6),
    barbers: [
      mkBarber("b17", "Mim Chowdhury", "Stylist", "5 yrs", ["Bridal"], "free", 4.7, 350, baseServices, barberPhotos[8]),
      mkBarber("b18", "Forhad Hossain", "Barber", "8 yrs", ["Classic", "Beard"], "free", 4.5, 330, baseServices, barberPhotos[6]),
    ],
  },
];

export function getSalon(id: string) {
  return salons.find((s) => s.id === id);
}

export function getBarber(barberId: string) {
  for (const salon of salons) {
    const b = salon.barbers.find((x) => x.id === barberId);
    if (b) return { salon, barber: b };
  }
  return null;
}

export const paymentMethods = [
  { id: "bkash", name: "bKash", brand: "oklch(0.6 0.25 0)", emoji: "📱" },
  { id: "nagad", name: "Nagad", brand: "oklch(0.65 0.22 30)", emoji: "💸" },
  { id: "rocket", name: "Rocket", brand: "oklch(0.55 0.2 300)", emoji: "🚀" },
  { id: "card", name: "Credit / Debit Card", brand: "oklch(0.55 0.22 285)", emoji: "💳" },
  { id: "cash", name: "Cash at Shop", brand: "oklch(0.6 0.18 150)", emoji: "💵" },
];

export const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "2:00 PM",
  "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
  "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM",
  "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

// Owner-side mock
export const ownerStats = {
  todayBookings: 28,
  todayEarnings: 12450,
  weekEarnings: 87320,
  activeBarbers: 4,
  queueNow: 6,
  rating: 4.9,
};

export const recentBookings = [
  { id: "TG-8821", customer: "Anika R.", barber: "Rohim Ahmed", service: "Classic Haircut", time: "11:30 AM", amount: 350, status: "confirmed" as const },
  { id: "TG-8820", customer: "Mahin K.", barber: "Karim Hossain", service: "Royal Shave", time: "12:00 PM", amount: 450, status: "in-chair" as const },
  { id: "TG-8819", customer: "Sumaiya I.", barber: "Niloy Khan", service: "Hair Color", time: "1:00 PM", amount: 1500, status: "confirmed" as const },
  { id: "TG-8818", customer: "Rafsan A.", barber: "Sharif Islam", service: "Kids Cut", time: "2:00 PM", amount: 180, status: "pending" as const },
  { id: "TG-8817", customer: "Tanjila H.", barber: "Rohim Ahmed", service: "Facial Glow", time: "3:30 PM", amount: 900, status: "confirmed" as const },
  { id: "TG-8816", customer: "Sabbir M.", barber: "Karim Hossain", service: "Beard Trim", time: "4:00 PM", amount: 200, status: "confirmed" as const },
];

export const earningsTrend = [
  { day: "Mon", value: 9200 }, { day: "Tue", value: 10400 }, { day: "Wed", value: 8600 },
  { day: "Thu", value: 11800 }, { day: "Fri", value: 14200 }, { day: "Sat", value: 18650 },
  { day: "Sun", value: 12450 },
];