import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instagram, Linkedin, PenLine, BookOpen, Palette, Heart, HeartPulse, Sparkles } from "lucide-react";
import { SiThreads, SiObsidian, SiGithub } from "react-icons/si";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Hardcoded profile data
const profile = {
  username: "yoonjujung",
  displayName: "Yoonju Jung",
  avatarUrl: "/attached_assets/222222_1766689747095.jpg",
  showUsername: false,
  bio: "Medical Student | Tech Enthusiast | Startup CEO | Art Lover\n\nI'm Yoonju from South Korea, sharing my journey through the medical school.",
  backgroundColor: "#ffffff",
  textColor: "#000000",
  buttonColor: "#ffffff",
  buttonTextColor: "#3b3b3b",
};

const links = [
  { id: 1, title: "Homepage", url: "https://substack.com/@yoonju", icon: "penline", tooltip: "Personal Blog, Portfolio, and CV" },
  { id: 2, title: "Instagram", url: "https://www.instagram.com/yoonjujung_/", icon: "instagram", tooltip: "Sharing personal experiences" },
  { id: 3, title: "LinkedIn", url: "https://www.linkedin.com/in/yoonju-jung-a80374315/", icon: "linkedin", tooltip: "Sharing professional experiences" },
  { id: 4, title: "Threads", url: "https://www.threads.com/@yoonjujung_", icon: "threads", tooltip: "Sharing my Insights\nand Creative Ideas" },
  { id: 5, title: "Github", url: "https://github.com/Yoonju-J", icon: "github", tooltip: "My Code Database" },
  { id: 6, title: "Rovodoc", url: "https://www.instagram.com/rovodoc/", icon: "sparkles", tooltip: "The First Robot Doctor" },
  { id: 7, title: "Code It Blue", url: "https://www.instagram.com/code.it.blue?igsh=aGljN29mcm9yY2V0", icon: "heartpulse", tooltip: "My Archive of Visual Notes" },
  { id: 8, title: "Personal Wiki", url: "https://publish.obsidian.md/mediair-03", icon: "obsidian", tooltip: "My Archive of Study Notes" },
];

function CherryBlossomAnimation({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  
  const petals = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: -5 - Math.random() * 15,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 3,
    size: 8 + Math.random() * 12,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-cherry-fall"
          style={{
            left: `${petal.startX}%`,
            top: `${petal.startY}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            className="animate-cherry-spin"
            style={{ animationDuration: `${2 + Math.random() * 2}s` }}
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z"
              fill="url(#petalGradient)"
              opacity="0.85"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fce7f3" />
                <stop offset="50%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f9a8d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}

function getLinkIcon(iconType: string) {
  switch (iconType) {
    case "instagram": return <Instagram className="w-5 h-5" />;
    case "linkedin": return <Linkedin className="w-5 h-5" />;
    case "book": return <BookOpen className="w-5 h-5" />;
    case "sparkles": return <Sparkles className="w-5 h-5" />;
    case "penline": return <PenLine className="w-5 h-5" />;
    case "threads": return <SiThreads className="w-5 h-5" />;
    case "obsidian": return <SiObsidian className="w-5 h-5" />;
    case "github": return <SiGithub className="w-5 h-5" />;
    case "palette": return <Palette className="w-5 h-5" />;
    case "heart": return <Heart className="w-5 h-5" />;
    case "heartpulse": return <HeartPulse className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
}

export default function PublicProfile() {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    setShowPetals(true);
    const hideTimeout = setTimeout(() => setShowPetals(false), 8000);

    const interval = setInterval(() => {
      setShowPetals(true);
      setTimeout(() => setShowPetals(false), 8000);
    }, 30000);

    return () => {
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, []);

  const bioLines = profile.bio.split('\n');
  const tagline = bioLines[0];
  const description = bioLines.slice(1).join('\n').trim();

  return (
    <div 
      className="min-h-screen transition-colors duration-500 relative overflow-hidden"
      style={{ 
        backgroundColor: profile.backgroundColor,
        color: profile.textColor,
      }}
    >
      <CherryBlossomAnimation isActive={showPetals} />
      <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 animate-in zoom-in-50 duration-500">
          <div className="relative mb-6 cursor-pointer group" onClick={() => setShowImageModal(true)} data-testid="button-profile-picture">
            {/* Corona gradient effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 blur-md opacity-70 scale-[1.03] transition-all duration-300 group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:opacity-90" />
            <Avatar className="relative w-[6.6rem] h-[6.6rem] border-4 shadow-xl transition-transform hover:scale-105" style={{ borderColor: 'white' }}>
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* Magnified profile picture modal */}
          <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
            <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none">
              <img 
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-auto rounded-full shadow-2xl"
                data-testid="img-magnified-profile"
              />
            </DialogContent>
          </Dialog>

          {profile.showUsername && (
            <p className="text-lg opacity-70 mb-2">@{profile.username}</p>
          )}
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>{profile.displayName}</h1>
          
          {tagline && <p className="text-base opacity-90 leading-relaxed whitespace-normal text-center md:whitespace-nowrap" style={{ color: '#000000' }}>{tagline}</p>}
          {description && <p className="text-sm opacity-90 max-w-sm leading-relaxed whitespace-pre-wrap mt-2" style={{ color: '#636363' }}>{description}</p>}
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {links.map((link, i) => (
            <div key={link.id}>
              {link.id === 6 && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                </div>
              )}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full p-4 rounded-xl text-center font-bold text-lg transition-colors duration-300 shadow-lg flex items-center gap-4 group animate-in slide-in-from-bottom-4 fill-mode-backwards hover:!bg-pink-100"
                style={{ 
                  backgroundColor: profile.buttonColor,
                  color: profile.buttonTextColor,
                  animationDelay: `${i * 100}ms`
                }}
                data-testid={`link-${link.id}`}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-500 transition-colors duration-300 group-hover:bg-pink-200 group-hover:text-pink-700">
                  {getLinkIcon(link.icon)}
              </span>
              <span className="flex-1 text-left truncate">{link.title}</span>
              {link.tooltip && (
                <span className="absolute right-0 bottom-full mb-2 px-3 py-2 rounded-lg bg-white text-pink-700 text-sm font-medium whitespace-pre text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-md">
                  {link.tooltip}
                </span>
              )}
              </a>
            </div>
          ))}
        </div>

        {/* Branding */}
        <div className="mt-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest opacity-70">
            <span>On the Record</span>
            <span className="text-pink-500 font-black">Since 2025</span>
          </span>
        </div>
      </div>
    </div>
  );
}
