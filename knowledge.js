// Sight Seers Caribbean Adventures — Knowledge Base
// Source: https://www.sightseerscaribbean.com/ (captured Sep 2026)
// Edit this file to keep the agent's answers accurate as the business changes.

module.exports = {
  business: {
    name: "Sight Seers Caribbean Adventures",
    tagline: "Group travel and experience brand across the Caribbean",
    managingDirector: "Daine Allen",
    location: "Turtle Beach Road, Ocho Rios, Jamaica",
    officeHours: "Monday to Sunday, 10:00 AM to 6:00 PM (Jamaica time, GMT-5). WhatsApp is available outside office hours.",
    contact: {
      phoneJamaica: "+1 (876) 465-0630",
      phoneUS: "+1 (347) 291-6868",
      supportPhoneUS2: "+1 954-268-8828",
      email: "info@sightseerscaribbean.com",
      instagram: "@sightseers.jm",
      tiktok: "@sightseers.jm",
    },
    destinations: [
      "Jamaica (islandwide)",
      "Barbados",
      "Saint Lucia",
      "The Bahamas",
      "Belize",
      "Dominican Republic",
      "Curaçao",
    ],
  },

  // What the business offers, grouped by category
  services: {
    tours: {
      description: "Islandwide excursions and curated experiences",
      categories: ["Water Experiences", "Land Experiences", "MBA Experience", "Custom Packages"],
      featured: [
        { name: "Night Glow Lagoon Experience", location: "Jamaica", from: 95, note: "Glowing-water evening experience" },
        { name: "Blue Hole Escape", location: "Jamaica", from: 120, note: "Cliff jumps and hidden pools" },
        { name: "Bamboo Rafting Experience", location: "Jamaica", from: 75, note: "Relaxed river experience on the Rio Grande, good for couples/friends" },
        { name: "Catamaran Party Cruise", location: "Jamaica", from: 110, note: "Group social cruise with music" },
      ],
      other: ["Zip-line / Canopy", "ATV Adventures", "Horseback Riding", "Parasailing", "Kayaking", "Snorkeling / Scuba", "Waterfalls trips", "Beach trips", "Efoil Surfboarding", "Luxury Getaway Weekend"],
    },
    transfers: {
      description: "Airport pickup, executive and group transfers",
      options: [
        { name: "Airport Pickup & Drop-Off", note: "MBJ (Montego Bay) and NMIA (Kingston) support. Custom quote." },
        { name: "Executive Transfers", note: "Mercedes fleet, VIP/point-to-point. Custom quote." },
        { name: "Group Transfers", note: "Coach buses: 53-seater, 37-seater Coaster, 28-seater. Custom quote." },
        { name: "Club Mobay / Club Kingston VIP airport lounge access" },
      ],
    },
    yachtCharters: {
      description: "Private and group sea days, celebration sailings",
      options: [
        { name: "Sunset Private Charter", size: "2 to 6 guests", duration: "3 to 4 hours", from: 350 },
        { name: "Proposal / Special Moment Charter", from: 500 },
        { name: "Island Group Cruise", size: "6 to 20+ guests", from: 600 },
        { name: "Luxury Executive Charter", from: 900 },
        { name: "Elite Celebration Charter", from: 1100 },
      ],
    },
    villas: {
      description: "Curated villas & vacation rentals across all 7 destinations",
    },
    groupTravel: {
      schoolTours: "Curated educational escapes and celebration outings for schools, clubs, youth groups",
      seniorTours: "Comfort-led scenic days for mature guests",
      greekLifeTravel: "Spring/summer escapes for fraternities, sororities, alumni circles — chapter trips, probate weekends, founders celebrations, graduation travel",
      customGroupTravel: "For friend groups, families, social circles of 5+ — birthdays, reunions, girls'/guys' trips, family escapes",
    },
    mbaExperience: {
      description: "Luxury development travel for MBA graduates, alumni, young professionals — private yacht days, villa dinners, networking, leadership sessions, curated company visits across Jamaica, Barbados, Saint Lucia and beyond.",
    },
    leadersInJamaica: {
      description: "Flagship 'Leaders in Jamaica' Leadership Institute — 5-day program pairing student leaders (fraternities, sororities, SGAs, non-profits, etc.) with a Jamaican university's student government (Northern Caribbean University or UWI Mona) for governance/policy work, plus one adventure day.",
      nextCohort: "Founding cohort: Wed 17 – Sun 21 Feb 2027, based at a private Montego Bay villa",
      pricing: [
        { cohort: "12–15 delegates", standard: 1270, earlyCommitment: 1195 },
        { cohort: "16–25 delegates", standard: 1220, earlyCommitment: 1145 },
        { cohort: "26–40 delegates", standard: 1170, earlyCommitment: 1095 },
      ],
      notes: [
        "Rates are per delegate, cover all 5 days and all transfers. Villa accommodation and airfare are separate.",
        "Early commitment: confirm in principle by 15 Oct 2026 to save US$75/delegate.",
        "Payment plan: US$35 deposit, then 4 instalments of US$290 (15 Nov, 15 Dec, 15 Jan, 5 Feb).",
        "Airfare (Miami–Montego Bay) typically US$280–380 return, booked by the delegate.",
        "Funding routes: self-funded, sponsored, organisation-funded, or SGA-sponsored seat.",
      ],
      contact: "Apply/Enquire or Talk to the Director via the website form or WhatsApp",
    },
    passportRenewal: {
      description: "Jamaican passport renewal support — guest uploads passport bio page, birth certificate IA No., and a digital passport-size photo; Sight Seers team follows up by email/WhatsApp.",
    },
    giftCards: {
      description: "Digital gift cards redeemable toward tours, transfers, stays and experiences.",
      amounts: [50, 100, 150, 200],
    },
    vTours: {
      description: "360°/virtual tour preview platform (V-Tours) — currently in private beta / early access.",
    },
  },

  booking: {
    depositRequired: "A non-refundable USD $15 deposit is required to begin/process any booking request. It is applied toward the final booking fee.",
    howToBook: "Via the 'Start Planning' travel form on the website, a discovery call, or directly on WhatsApp.",
    groupDiscounts: "Discounted rates available for groups of 10+ travelers — contact for a custom quote.",
    airportShuttle: "Available for groups of 5 or more to/from NMIA (Kingston) and MBJ (Montego Bay).",
  },

  refundPolicy: {
    effectiveDate: "24 June 2025",
    standardCancellation: [
      { window: "7+ calendar days before tour date", refund: "100%, no fees" },
      { window: "3 to 6 days before", refund: "50% of total invoice" },
      { window: "Less than 72 hours or no-show", refund: "0%, non-refundable" },
    ],
    medicalEmergency: "Documented medical emergency (doctor's note within 5 days of missed tour): 75% refund or one-time free reschedule.",
    weatherPolicy: "Operates rain or shine; cancels only for lightning within 5km, tropical storm/hurricane watches, or sea state Beaufort 5+. Guests get full refund or reschedule in that case.",
    privateCharters: [
      { window: "14+ days notice", refund: "100% less unrecoverable third-party costs (yacht hire, permits)" },
      { window: "7 to 13 days notice", refund: "100% less unrecoverable third-party costs" },
      { window: "Less than 7 days", refund: "Non-refundable; rescheduling incurs 20% re-booking fee" },
    ],
    modifications: "One complimentary date/time change per booking if requested 72+ hours in advance. Later changes: US $20/person admin fee. Free name substitutions until 24 hours prior.",
    nonRefundable: "Park entry fees once remitted; card/bank processing fees (2-3%); gift cards/vouchers (transferable, never refundable for cash).",
    processingTime: "7 to 10 business days to original payment method after approval.",
    fullPolicyNote: "Full policy at sightseerscaribbean.com — Customer Support > Refund & Cancellation Policy. Governed by the laws of Jamaica.",
  },

  faq: [
    {
      q: "Is a deposit required to book?",
      a: "Yes, a non-refundable USD $15 deposit is required to process your request. This is applied toward your booking fee.",
    },
    {
      q: "What is your cancellation policy?",
      a: "Cancellations made 72+ hours before the tour date may receive a partial refund (excluding the $15 deposit). 7+ days = 100% refund, 3-6 days = 50%, under 72 hours = non-refundable.",
    },
    {
      q: "Do you offer group discounts?",
      a: "Yes — discounted rates for groups of 10 or more travelers. Contact us directly for a custom quote.",
    },
    {
      q: "Can I reach you on WhatsApp?",
      a: "Yes — message +1 (876) 465-0630 on WhatsApp and the team responds as quickly as possible.",
    },
    {
      q: "What destinations do you serve?",
      a: "Jamaica (islandwide), Barbados, Belize, The Bahamas, Saint Lucia, Curaçao, and the Dominican Republic.",
    },
    {
      q: "How do I book airport shuttle service?",
      a: "Shuttle to NMIA (Kingston) and MBJ (Montego Bay) is available for groups of 5 or more. Contact with travel details.",
    },
  ],
};
