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
  services: Service[]
): Barber => ({ id, name, designation, experience, skills, status, rating, avatarHue: hue, services });

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
    barbers: [
      mkBarber("b1", "Rohim Ahmed", "Senior Stylist", "8 yrs", ["Fade", "Color", "Beard"], "free", 4.9, 285, baseServices),
      mkBarber("b2", "Karim Hossain", "Master Barber", "12 yrs", ["Classic", "Shave"], "busy", 4.8, 200, baseServices),
      mkBarber("b3", "Sharif Islam", "Stylist", "4 yrs", ["Modern", "Kids"], "free", 4.7, 320, baseServices),
      mkBarber("b4", "Niloy Khan", "Color Specialist", "6 yrs", ["Color", "Highlights"], "free", 4.9, 30, baseServices),
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
    barbers: [
      mkBarber("b5", "Tareq Mahmud", "Senior Barber", "10 yrs", ["Fade", "Shave"], "busy", 4.8, 200, baseServices),
      mkBarber("b6", "Joy Roy", "Barber", "3 yrs", ["Classic"], "free", 4.6, 230, baseServices),
      mkBarber("b7", "Imran Sheikh", "Barber", "5 yrs", ["Modern"], "offline", 4.5, 180, baseServices),
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
    barbers: [
      mkBarber("b8", "Sumon Ali", "Barber", "2 yrs", ["Classic"], "free", 4.3, 140, baseServices.slice(0, 3)),
      mkBarber("b9", "Rafi Uddin", "Barber", "4 yrs", ["Quick"], "free", 4.5, 160, baseServices.slice(0, 3)),
      mkBarber("b10", "Mizan Rahman", "Barber", "3 yrs", ["Kids"], "busy", 4.2, 120, baseServices.slice(0, 3)),
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
    barbers: [
      mkBarber("b11", "Nadia Akter", "Lead Stylist", "9 yrs", ["Color", "Bridal"], "offline", 4.9, 340, baseServices),
      mkBarber("b12", "Sabbir Hasan", "Senior Stylist", "7 yrs", ["Fade", "Beard"], "offline", 4.8, 300, baseServices),
      mkBarber("b13", "Tasnim Jahan", "Color Expert", "5 yrs", ["Color"], "offline", 4.7, 20, baseServices),
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
    barbers: [
      mkBarber("b14", "Hasib Karim", "Fade Artist", "6 yrs", ["Fade", "Design"], "free", 4.9, 25, baseServices),
      mkBarber("b15", "Tanvir Alam", "Barber", "4 yrs", ["Classic"], "free", 4.6, 50, baseServices),
      mkBarber("b16", "Riaz Mia", "Junior", "2 yrs", ["Beard"], "busy", 4.4, 10, baseServices),
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
    barbers: [
      mkBarber("b17", "Mim Chowdhury", "Stylist", "5 yrs", ["Bridal"], "free", 4.7, 350, baseServices),
      mkBarber("b18", "Forhad Hossain", "Barber", "8 yrs", ["Classic", "Beard"], "free", 4.5, 330, baseServices),
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