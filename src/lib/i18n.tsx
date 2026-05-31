import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

/** Dictionary: English source string → Bengali translation. */
const bn: Record<string, string> = {
  // ===== Common =====
  "Back": "ফিরে যান",
  "Cancel": "বাতিল",
  "Save": "সংরক্ষণ",
  "Save changes": "পরিবর্তন সংরক্ষণ",
  "Saving…": "সংরক্ষণ হচ্ছে…",
  "Saved": "সংরক্ষিত",
  "Edit": "সম্পাদনা",
  "Delete": "মুছুন",
  "Remove": "সরান",
  "Confirmed": "নিশ্চিত",
  "Completed": "সম্পন্ন",
  "Open": "খোলা",
  "Closed": "বন্ধ",
  "Open now": "এখন খোলা",
  "Today": "আজ",
  "Tomorrow": "আগামীকাল",
  "Online": "অনলাইন",
  "Sign out": "সাইন আউট",
  "Less": "কম",
  "More": "আরও",
  "All services": "সব সেবা",
  "Reply": "উত্তর দিন",
  "Mark featured": "বিশেষ করুন",
  "Live": "লাইভ",
  "Reschedule": "পুনর্নির্ধারণ",
  "Free": "ফ্রি",
  "Busy": "ব্যস্ত",
  "Offline": "অফলাইন",
  "Free now": "এখন ফ্রি",
  "With customer": "গ্রাহকের সাথে",
  "Photo": "ছবি",
  "Logo": "লোগো",
  "ID": "আইডি",
  "Customer": "গ্রাহক",
  "Barber": "বার্বার",
  "Service": "সেবা",
  "Time": "সময়",
  "Amount": "পরিমাণ",
  "Status": "অবস্থা",
  "Actions": "অ্যাকশন",
  "Manage →": "পরিচালনা →",
  "View all →": "সব দেখুন →",
  "Reply →": "উত্তর দিন →",

  // ===== Splash / index =====
  "Find salons & barbers near you": "আপনার কাছাকাছি সেলুন ও বার্বার খুঁজুন",
  "We need your location to show real-time nearby shops, prices and wait times.":
    "কাছাকাছি দোকান, দাম ও অপেক্ষার সময় রিয়েল-টাইমে দেখাতে আমাদের আপনার লোকেশন প্রয়োজন।",
  "Auto-detect nearby salons": "কাছাকাছি সেলুন স্বয়ংক্রিয়ভাবে খুঁজুন",
  "Live crowd & queue updates": "লাইভ ভিড় ও কিউ আপডেট",
  "Your location stays private": "আপনার লোকেশন গোপন থাকবে",
  "Allow location access": "লোকেশন অ্যাক্সেস দিন",
  "Not now": "এখন নয়",
  "Detecting your location…": "আপনার লোকেশন খুঁজে বের করা হচ্ছে…",
  "Finding salons near Gulshan 2": "গুলশান ২ এর কাছাকাছি সেলুন খোঁজা হচ্ছে",
  "By continuing you agree to TrimGo's Terms & Privacy":
    "চালিয়ে গেলে আপনি TrimGo এর শর্ত ও গোপনীয়তা মেনে নিচ্ছেন",

  // ===== Login =====
  "Sign in": "সাইন ইন",
  "Welcome back": "আবার স্বাগতম",
  "Create your account": "আপনার অ্যাকাউন্ট তৈরি করুন",
  "Required to confirm and pay for your booking":
    "বুকিং নিশ্চিত ও পেমেন্টের জন্য প্রয়োজন",
  "Continue with Google": "Google দিয়ে চালিয়ে যান",
  "or": "অথবা",
  "Full name": "পুরো নাম",
  "Your name": "আপনার নাম",
  "Email": "ইমেইল",
  "Password": "পাসওয়ার্ড",
  "Sign in & continue": "সাইন ইন ও চালিয়ে যান",
  "Create account & continue": "অ্যাকাউন্ট তৈরি ও চালিয়ে যান",
  "New here? ": "নতুন এখানে? ",
  "Already have an account? ": "ইতিমধ্যে একটি অ্যাকাউন্ট আছে? ",
  "Create account": "অ্যাকাউন্ট তৈরি",

  // ===== Home =====
  "Current location": "বর্তমান অবস্থান",
  "Search salons, barbers, services": "সেলুন, বার্বার, সেবা খুঁজুন",
  "Browse by price": "দাম অনুসারে দেখুন",
  "Map view": "ম্যাপ ভিউ",
  "List view": "তালিকা ভিউ",
  "All": "সব",
  "Low Cost": "কম দাম",
  "Medium": "মাঝারি",
  "Premium": "প্রিমিয়াম",
  "Sort": "সাজান",
  "Nearest": "নিকটতম",
  "Top rated": "সেরা রেটিং",
  "Lowest price": "সর্বনিম্ন দাম",
  "Highest price": "সর্বোচ্চ দাম",
  "Most popular": "সর্বাধিক জনপ্রিয়",
  "Nearby salons": "কাছাকাছি সেলুন",
  "found": "পাওয়া গেছে",
  "No wait": "অপেক্ষা নেই",
  "Few in queue": "কয়েকজন অপেক্ষায়",
  "Busy queue": "ব্যস্ত কিউ",
  "From": "শুরু",
  "up to": "পর্যন্ত",
  "Book →": "বুক →",
  "Showing": "দেখানো হচ্ছে",
  "salons near you": "সেলুন আপনার কাছাকাছি",

  // ===== Salon details =====
  "Share": "শেয়ার",
  "Favorite": "প্রিয়",
  "Added to favorites": "প্রিয়তে যোগ করা হয়েছে",
  "Removed from favorites": "প্রিয় থেকে সরানো হয়েছে",
  "Share link ready": "শেয়ার লিঙ্ক প্রস্তুত",
  "km away": "কিমি দূরে",
  "Call": "কল",
  "Directions": "দিকনির্দেশনা",
  "Our team": "আমাদের টিম",
  "Location": "অবস্থান",
  "Salon location": "সেলুনের অবস্থান",
  "Opening hours": "খোলার সময়",
  "Popular services": "জনপ্রিয় সেবা",
  "Reviews": "রিভিউ",
  "Select": "নির্বাচন",
  "Chat": "চ্যাট",

  // ===== Booking =====
  "Book appointment": "অ্যাপয়েন্টমেন্ট বুক",
  "Confirmed available": "উপলব্ধ নিশ্চিত",
  "Choose services": "সেবা নির্বাচন",
  "tap to add multiple": "একাধিক যোগ করতে ট্যাপ করুন",
  "selected": "নির্বাচিত",
  "Pick a time slot · Today": "সময় স্লট বেছে নিন · আজ",
  "Total duration": "মোট সময়",
  "Live queue": "লাইভ কিউ",
  "ahead": "সামনে",
  "min": "মিনিট",
  "Price summary": "দামের সারাংশ",
  "Booking fee": "বুকিং ফি",
  "VAT (5%)": "ভ্যাট (৫%)",
  "Total": "মোট",
  "Select at least one service.": "অন্তত একটি সেবা নির্বাচন করুন।",
  "Continue": "চালিয়ে যান",

  // ===== Payment =====
  "Checkout": "চেকআউট",
  "Salon": "সেলুন",
  "Amount to pay": "পরিশোধ করার পরিমাণ",
  "Secured by TrimGo Pay · 256-bit encrypted":
    "TrimGo Pay দ্বারা সুরক্ষিত · ২৫৬-বিট এনক্রিপ্টেড",
  "Order summary": "অর্ডার সারাংশ",
  "service": "সেবা",
  "services": "সেবাসমূহ",
  "with": "এর সাথে",
  "Subtotal": "সাব-টোটাল",
  "Choose payment method": "পেমেন্ট পদ্ধতি বেছে নিন",
  "Pay when you arrive": "পৌঁছালে পরিশোধ করুন",
  "Instant transfer": "তাৎক্ষণিক ট্রান্সফার",
  "Scan with your": "স্ক্যান করুন আপনার",
  "app": "অ্যাপ দিয়ে",
  "QR refreshes every 60s": "QR প্রতি ৬০ সেকেন্ডে রিফ্রেশ হয়",
  "Card number": "কার্ড নম্বর",
  "Cardholder name": "কার্ডধারীর নাম",
  "Pay": "পরিশোধ",
  "Securing your booking…": "আপনার বুকিং সুরক্ষিত করা হচ্ছে…",

  // ===== Success =====
  "Seat Reserved!": "আসন সংরক্ষিত!",
  "Your booking is confirmed. We can't wait to see you.":
    "আপনার বুকিং নিশ্চিত হয়েছে। আমরা আপনাকে দেখার অপেক্ষায়।",
  "Booking ID": "বুকিং আইডি",
  "CONFIRMED": "নিশ্চিত",
  "Paid via": "পরিশোধিত",
  "Your queue position": "আপনার কিউ অবস্থান",
  "Estimated wait": "আনুমানিক অপেক্ষা",
  "minutes": "মিনিট",
  "Navigate": "নেভিগেট",
  "Back to home": "হোমে ফিরুন",

  // ===== Bookings list =====
  "My bookings": "আমার বুকিং",
  "Manage your appointments": "আপনার অ্যাপয়েন্টমেন্ট পরিচালনা করুন",
  "upcoming": "আসন্ন",
  "past": "অতীত",
  "No upcoming bookings.": "কোনো আসন্ন বুকিং নেই।",
  "Book a salon": "একটি সেলুন বুক করুন",
  "Receipt": "রসিদ",
  "Rate": "রেট করুন",
  "Book again": "আবার বুক করুন",
  "Cancel booking": "বুকিং বাতিল",
  "Keep booking": "বুকিং রাখুন",
  "Booking cancelled. Refund issued.": "বুকিং বাতিল। রিফান্ড দেওয়া হয়েছে।",
  "Reschedule flow opening soon.": "পুনর্নির্ধারণ ফ্লো শীঘ্রই খুলবে।",
  "Thanks for rating!": "রেট করার জন্য ধন্যবাদ!",

  // ===== Chats =====
  "Messages": "বার্তা",
  "conversations": "কথোপকথন",
  "Search messages": "বার্তা খুঁজুন",
  "Chatting with": "চ্যাট করছেন",
  "Type a message…": "একটি বার্তা টাইপ করুন…",
  "Online · typically replies in minutes": "অনলাইন · সাধারণত কয়েক মিনিটে উত্তর দেয়",
  "Book": "বুক",

  // ===== Profile =====
  "Profile": "প্রোফাইল",
  "Bookings": "বুকিং",
  "Favorites": "প্রিয়",
  "Rating": "রেটিং",
  "Own a salon?": "একটি সেলুন আছে?",
  "Switch to owner dashboard": "মালিক ড্যাশবোর্ডে যান",
  "Favorite salons": "প্রিয় সেলুন",
  "Payment methods": "পেমেন্ট পদ্ধতি",
  "Saved addresses": "সংরক্ষিত ঠিকানা",
  "Notifications": "বিজ্ঞপ্তি",
  "Dark mode": "ডার্ক মোড",
  "Help & support": "সাহায্য ও সহায়তা",

  // ===== Owner shell =====
  "Salon owner": "সেলুনের মালিক",
  "Dashboard": "ড্যাশবোর্ড",
  "Employees": "কর্মী",
  "Services": "সেবা",
  "Salon profile": "সেলুন প্রোফাইল",
  "Search employees, services, bookings…": "কর্মী, সেবা, বুকিং খুঁজুন…",
  "Toggle theme": "থিম পরিবর্তন",
  "Owner": "মালিক",
  "Settings": "সেটিংস",

  // ===== Owner dashboard =====
  "Good morning, Anwar": "সুপ্রভাত, আনোয়ার",
  "Quick add": "দ্রুত যোগ",
  "Today's earnings": "আজকের আয়",
  "Today's bookings": "আজকের বুকিং",
  "Active employees": "সক্রিয় কর্মী",
  "Avg rating": "গড় রেটিং",
  "this wk": "এই সপ্তাহে",
  "Weekly earnings": "সাপ্তাহিক আয়",
  "Total this week": "এই সপ্তাহের মোট",
  "vs last week": "গত সপ্তাহের তুলনায়",
  "in queue": "কিউতে",
  "Next in 3 min": "৩ মিনিটে পরবর্তী",
  "With customer · 12 min left": "গ্রাহকের সাথে · ১২ মিনিট বাকি",
  "Manage team": "টিম পরিচালনা",
  "employees": "কর্মী",
  "on duty": "দায়িত্বে",
  "ready now": "এখন প্রস্তুত",
  "Add services to start earning": "আয় শুরু করতে সেবা যোগ করুন",
  "Recent bookings": "সাম্প্রতিক বুকিং",
  "Customer reviews": "গ্রাহকের রিভিউ",
  "reviews this month": "এই মাসের রিভিউ",

  // ===== Owner employees =====
  "on your team": "আপনার টিমে",
  "available right now": "এখন উপলব্ধ",
  "Add employee": "কর্মী যোগ",
  "Search by name, role, skill…": "নাম, ভূমিকা, দক্ষতা দিয়ে খুঁজুন…",
  "Filter by service": "সেবা অনুসারে ফিল্টার",
  "No employees match": "কোনো মিলে এমন কর্মী নেই",
  "Try a different search or add a new team member.":
    "অন্য সার্চ চেষ্টা করুন বা নতুন কর্মী যোগ করুন।",
  "Remove employee?": "কর্মী সরাবেন?",
  "This will permanently remove the employee from your salon. Existing bookings will not be affected.":
    "এটি স্থায়ীভাবে কর্মীকে আপনার সেলুন থেকে সরিয়ে দেবে। বিদ্যমান বুকিং প্রভাবিত হবে না।",
  "Employee removed": "কর্মী সরানো হয়েছে",
  "Employee updated": "কর্মী আপডেট হয়েছে",
  "Employee added": "কর্মী যোগ হয়েছে",
  "Edit employee": "কর্মী সম্পাদনা",
  "Add new employee": "নতুন কর্মী যোগ",
  "Update profile, services, and availability.": "প্রোফাইল, সেবা এবং উপলব্ধতা আপডেট করুন।",
  "Add a new team member to your salon.": "আপনার সেলুনে নতুন কর্মী যোগ করুন।",
  "Profile photo": "প্রোফাইল ছবি",
  "Drag & drop or click to upload. Square images look best.":
    "টেনে আনুন বা ক্লিক করে আপলোড করুন। বর্গাকার ছবি ভালো দেখায়।",
  "Phone": "ফোন",
  "Role": "ভূমিকা",
  "Address": "ঠিকানা",
  "Experience": "অভিজ্ঞতা",
  "Availability": "উপলব্ধতা",
  "Skills (comma separated)": "দক্ষতা (কমা দিয়ে আলাদা)",
  "Assigned services": "অ্যাসাইন করা সেবা",
  "No services yet — add some first.": "এখনো কোনো সেবা নেই — প্রথমে যোগ করুন।",
  "Name is required": "নাম প্রয়োজন",
  "is now": "এখন",

  // ===== Owner services =====
  "services across your menu": "আপনার মেনুতে সেবা",
  "Add service": "সেবা যোগ",
  "Search services or category…": "সেবা বা ক্যাটাগরি খুঁজুন…",
  "No services yet": "এখনো কোনো সেবা নেই",
  "Build your menu to start accepting bookings.":
    "বুকিং নিতে আপনার মেনু তৈরি করুন।",
  "Add your first service": "আপনার প্রথম সেবা যোগ করুন",
  "Unassigned": "অ্যাসাইন নয়",
  "Delete this service?": "এই সেবা মুছবেন?",
  "It will be removed from your menu and unassigned from any employees.":
    "এটি আপনার মেনু থেকে সরানো হবে এবং কর্মীদের থেকে আনঅ্যাসাইন হবে।",
  "Service deleted": "সেবা মুছে দেওয়া হয়েছে",
  "Service added": "সেবা যোগ হয়েছে",
  "Service updated": "সেবা আপডেট হয়েছে",
  "Edit service": "সেবা সম্পাদনা",
  "Add new service": "নতুন সেবা যোগ",
  "Set pricing, duration and assign team members.":
    "মূল্য, সময় নির্ধারণ ও কর্মী অ্যাসাইন করুন।",
  "Service name": "সেবার নাম",
  "Description": "বিবরণ",
  "Short description for customers": "গ্রাহকদের জন্য সংক্ষিপ্ত বিবরণ",
  "Category": "ক্যাটাগরি",
  "Duration (min)": "সময় (মিনিট)",
  "Price (৳)": "দাম (৳)",
  "Assign to employees": "কর্মীদের অ্যাসাইন",
  "Add employees first to assign services.":
    "সেবা অ্যাসাইন করতে প্রথমে কর্মী যোগ করুন।",
  "Set a valid price": "একটি বৈধ দাম দিন",

  // ===== Owner bookings page =====
  "Accept, reschedule or cancel appointments":
    "অ্যাপয়েন্টমেন্ট গ্রহণ, পুনর্নির্ধারণ বা বাতিল করুন",

  // ===== Owner settings =====
  "How customers see your shop": "গ্রাহকরা আপনার দোকান কীভাবে দেখে",
  "Salon profile saved": "সেলুন প্রোফাইল সংরক্ষিত",
  "Your customers will see updates instantly.":
    "আপনার গ্রাহকরা আপডেট তাৎক্ষণিকভাবে দেখবেন।",
  "Drop cover banner": "কভার ব্যানার রাখুন",
  "Salon name": "সেলুনের নাম",
  "Tagline": "ট্যাগলাইন",
  "About": "সম্পর্কে",
  "Business hours": "ব্যবসার সময়",
  "Social links": "সামাজিক লিঙ্ক",
  "Instagram handle": "ইনস্টাগ্রাম হ্যান্ডেল",
  "Facebook page": "ফেসবুক পেজ",
  "Website": "ওয়েবসাইট",
  "Your salon": "আপনার সেলুন",
  "Live preview": "লাইভ প্রিভিউ",
  "Setup progress": "সেটআপ অগ্রগতি",
  "Cover banner": "কভার ব্যানার",
  "Add employees": "কর্মী যোগ",
  "Add services": "সেবা যোগ",
  "Home": "হোম",
  "Chats": "চ্যাট",
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (s: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (s) => s,
});

const STORAGE_KEY = "tg.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
      if (stored === "en" || stored === "bn") setLangState(stored);
    } catch { /* ignore */ }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    try { document.documentElement.setAttribute("lang", l); } catch { /* ignore */ }
  }

  function t(s: string) {
    if (lang === "bn") return bn[s] ?? s;
    return s;
  }

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  return useContext(Ctx);
}