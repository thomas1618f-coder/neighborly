/**
 * Mock community data for Neighborly
 */
const LISTINGS = [
  {
    id: 1,
    title: "Fresh garden tomatoes",
    desc: "About 2 lbs of ripe heirloom tomatoes from our backyard. Perfect for sauce or salad. Pickup anytime today.",
    category: "food",
    emoji: "🍅",
    when: "Available now",
    distance: "0.3 mi",
    user: "Maria L.",
    rating: 4.9,
    type: "give"
  },
  {
    id: 2,
    title: "Cordless drill + bits",
    desc: "DeWalt 20V drill, lightly used. Happy to lend for the weekend. Just bring it back charged!",
    category: "tools",
    emoji: "🔩",
    when: "This weekend",
    distance: "0.7 mi",
    user: "James K.",
    rating: 5.0,
    type: "loan"
  },
  {
    id: 3,
    title: "Help moving a couch",
    desc: "Need two strong hands to move a sofa from the 2nd floor to a truck. Takes ~30 min. Coffee & snacks provided.",
    category: "volunteer",
    emoji: "🛋️",
    when: "Today 4pm",
    distance: "1.1 mi",
    user: "Sam T.",
    rating: 4.8,
    type: "request"
  },
  {
    id: 4,
    title: "Kids winter coats (size 6-8)",
    desc: "Three gently used coats, cleaned and ready. Ages 5–9. Free to any family who needs them.",
    category: "donate",
    emoji: "🧥",
    when: "Available now",
    distance: "0.5 mi",
    user: "Priya R.",
    rating: 4.9,
    type: "give"
  },
  {
    id: 5,
    title: "Homemade sourdough loaves",
    desc: "Baked this morning. Two extra loaves — one plain, one with seeds. First come first served.",
    category: "food",
    emoji: "🍞",
    when: "Available now",
    distance: "0.4 mi",
    user: "Alex R.",
    rating: 5.0,
    type: "give"
  },
  {
    id: 6,
    title: "Ladder (12 ft)",
    desc: "Aluminum extension ladder. Good for gutters or painting. Can drop off if nearby.",
    category: "tools",
    emoji: "🪜",
    when: "Flexible",
    distance: "1.4 mi",
    user: "Chris M.",
    rating: 4.7,
    type: "loan"
  },
  {
    id: 7,
    title: "Walk dogs this weekend",
    desc: "Going out of town Sat–Sun. Looking for someone to walk our two friendly labs twice a day. $40 + treats.",
    category: "volunteer",
    emoji: "🐕",
    when: "This weekend",
    distance: "0.9 mi",
    user: "Jordan P.",
    rating: 4.9,
    type: "request"
  },
  {
    id: 8,
    title: "Extra rice & canned goods",
    desc: "Pantry clean-out. Several bags of rice, beans, and canned veggies. All unopened and in date.",
    category: "food",
    emoji: "🥫",
    when: "Today",
    distance: "0.6 mi",
    user: "Elena V.",
    rating: 4.8,
    type: "give"
  },
  {
    id: 9,
    title: "Tutoring: middle-school math",
    desc: "Retired teacher happy to help with algebra or geometry. Free for local students, flexible evenings.",
    category: "skills",
    emoji: "📐",
    when: "Flexible",
    distance: "1.2 mi",
    user: "Dr. Helen W.",
    rating: 5.0,
    type: "give"
  },
  {
    id: 10,
    title: "Bike repair help needed",
    desc: "Flat tire and rusty chain on my commuter bike. Looking for someone who knows bikes for 20–30 min.",
    category: "request",
    emoji: "🚲",
    when: "This weekend",
    distance: "0.8 mi",
    user: "Taylor B.",
    rating: 4.6,
    type: "request"
  },
  {
    id: 11,
    title: "Power washer",
    desc: "Electric pressure washer. Great for decks and sidewalks. Available most weekdays.",
    category: "tools",
    emoji: "💦",
    when: "Flexible",
    distance: "1.6 mi",
    user: "Mike S.",
    rating: 4.8,
    type: "loan"
  },
  {
    id: 12,
    title: "Community garden weeding",
    desc: "Join us Saturday morning at the Maple Community Garden. Tools provided, all skill levels welcome.",
    category: "volunteer",
    emoji: "🌿",
    when: "Sat 9am",
    distance: "0.2 mi",
    user: "Garden Collective",
    rating: 5.0,
    type: "event"
  }
];

const HIGHLIGHTS = [
  { icon: "🍎", text: "<strong>Maria</strong> shared 4 bags of fresh produce with neighbors this week." },
  { icon: "🔧", text: "<strong>James</strong> lent his drill to three different people — a true tool library!" },
  { icon: "❤️", text: "The community logged <strong>46 volunteer hours</strong> supporting local needs." },
  { icon: "🌱", text: "Maple District hit a new record: <strong>128 meals</strong> shared this month." }
];

const MY_POSTS = [
  {
    id: 101,
    title: "Homemade sourdough loaves",
    category: "food",
    emoji: "🍞",
    status: "Active · 2 interested"
  },
  {
    id: 102,
    title: "Offered help with yard work",
    category: "
