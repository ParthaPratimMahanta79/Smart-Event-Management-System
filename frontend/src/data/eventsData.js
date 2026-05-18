export const COMMITTEES = {
  "Sports Committee":   { icon: "🏆", color: "#dc2626" },
  "Coding Committee":   { icon: "💻", color: "#1d6fa4" },
  "Robotics Club":      { icon: "🤖", color: "#7c3aed" },
  "Cultural Committee": { icon: "🎭", color: "#ea580c" },
  "Media Committee":    { icon: "📸", color: "#0891b2" },
  "NSS Committee":      { icon: "🌿", color: "#15803d" },
  "Art Committee":      { icon: "🎨", color: "#9333ea" },
};

export const ALL_COMMITTEES = ["All Committees", ...Object.keys(COMMITTEES)];

export const ONGOING_EVENTS = [
  {
    id: 101,
    title: "Marathon",
    category: "Sports",
    committee: "Sports Committee",
    day: "15", month: "May",
    time: "8:00 AM - 11:00 AM",
    location: "Dhemaji Engineering College, Dhemaji",
    description: "A marathon event organized as part of the annual Sports Week at Dhemaji Engineering College, bringing together students for endurance, fitness, and team spirit.",
    image: "/images/Event-image/marathon.jpeg",
    isTeam: false,
  },
  {
    id: 102,
    title: "High Jump",
    category: "Sports",
    committee: "Sports Committee",
    day: "15", month: "May",
    time: "10:00 AM - 11:00 AM",
    location: "Dhemaji Engineering College, Dhemaji",
    description: "An exciting high jump competition hosted during the Sports Week of Dhemaji Engineering College.",
    image: "/images/Event-image/highjump.jpeg",
    isTeam: false,
  },
  {
    id: 103,
    title: "Tug of War",
    category: "Sports",
    committee: "Sports Committee",
    day: "15", month: "May",
    time: "12:30 PM - 2:00 PM",
    location: "Dhemaji Engineering College, Dhemaji",
    description: "A thrilling tug of war competition organized as part of the Dhemaji Engineering College Sports Week.",
    image: "/images/Event-image/tugofwar.jpeg",
    isTeam: true,
  },
];

export const UPCOMING_EVENTS = [
 
];

export const PAST_EVENTS = [
  {
    id: 201,
    title: "Inter-Department Badminton Tournament",
    category: "Sports",
    committee: "Sports Committee",
    day: "14", month: "May",
    time: "9:00 AM – 12:00 PM",
    location: "Mechanical Workshop, Dhemaji Engineering College",
    description: "An exciting badminton tournament between different departments of DEC held during the annual sports week.",
    image: "/images/Event-image/badminton.jpg",
    isTeam: false,
  },
  {
    id: 202,
    title: "DEC Chess Championship",
    category: "Sports",
    committee: "Sports Committee",
    day: "14", month: "May",
    time: "1:00 PM – 4:00 PM",
    location: "Mechanical Workshop, Dhemaji Engineering College",
    description: "A strategic chess competition where students showcased analytical thinking and competitive spirit.",
    image: "/images/Event-image/chess.jpg",
    isTeam: false,
  },
  {
    id: 203,
    title: "Cricket League",
    category: "Sports",
    committee: "Sports Committee",
    day: "14", month: "May",
    time: "8:00 AM – 3:00 PM",
    location: "Tekjuri Highschool Field",
    description: "A thrilling cricket tournament featuring energetic performances and strong team coordination.",
    image: "/images/Event-image/cricket.jpeg",
    isTeam: true,
  },
  {
    id: 204,
    title: "Code Arena 2026",
    category: "Technology",
    committee: "Coding Committee",
    day: "12", month: "May",
    time: "10:00 AM – 1:00 PM",
    location: "Computer Lab, Dhemaji Engineering College",
    description: "A competitive coding contest where participants solved real-world programming problems.",
    image: "/images/Event-image/codingbootcamp.jpg",
    isTeam: false,
  },
  {
    id: 205,
    title: "DSA Coding Bootcamp",
    category: "Technology",
    committee: "Robotics Club",
    day: "07", month: "May",
    time: "11:00 AM – 2:00 PM",
    location: "Seminar Hall, Dhemaji Engineering College",
    description: "A hands-on bootcamp on Data Structures and Algorithms organized by the Robotics & Coding Club.",
    image: "/images/Event-image/DSA.jpg",
    isTeam: false,
  },
  {
    id: 206,
    title: "Wall Painting Competition",
    category: "Art",
    committee: "Art Committee",
    day: "05", month: "May",
    time: "10:00 AM – 1:00 PM",
    location: "Academic Block, Dhemaji Engineering College",
    description: "A creative wall painting competition where students expressed artistic ideas through vibrant campus artwork.",
    image: "/images/Event-image/wallpainting.jpg",
    isTeam: false,
  },
];


export const ALL_EVENTS = [...ONGOING_EVENTS,  ...PAST_EVENTS];