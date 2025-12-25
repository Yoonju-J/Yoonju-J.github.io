import type { Profile, Link } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Instagram, Twitter, Linkedin, Youtube, Github, Facebook, Mail, Link2, Music, BookOpen } from "lucide-react";
import { SiThreads, SiObsidian } from "react-icons/si";
import { cn } from "@/lib/utils";

function getLinkIcon(url: string, title: string, iconName?: string | null) {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Check title for specific matches first
  if (titleLower.includes('physical ai')) return <BookOpen className="w-4 h-4" />;
  if (titleLower.includes('threads') || urlLower.includes('threads')) return <SiThreads className="w-4 h-4" />;
  if (titleLower.includes('wiki') || urlLower.includes('obsidian')) return <SiObsidian className="w-4 h-4" />;
  
  // URL-based matching
  if (urlLower.includes('instagram')) return <Instagram className="w-4 h-4" />;
  if (urlLower.includes('twitter') || urlLower.includes('x.com')) return <Twitter className="w-4 h-4" />;
  if (urlLower.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
  if (urlLower.includes('youtube')) return <Youtube className="w-4 h-4" />;
  if (urlLower.includes('github')) return <Github className="w-4 h-4" />;
  if (urlLower.includes('facebook')) return <Facebook className="w-4 h-4" />;
  if (urlLower.includes('spotify') || urlLower.includes('music')) return <Music className="w-4 h-4" />;
  if (urlLower.includes('notion')) return <BookOpen className="w-4 h-4" />;
  if (urlLower.includes('mailto:')) return <Mail className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

interface PhonePreviewProps {
  profile: Profile | null;
  links: Link[] | undefined;
}

export function PhonePreview({ profile, links }: PhonePreviewProps) {
  if (!profile) return (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
      Loading preview...
    </div>
  );

  const containerStyle = {
    backgroundColor: profile.backgroundColor,
    color: profile.textColor,
    fontFamily: profile.font === 'Inter' ? 'sans-serif' : profile.font,
  };

  const buttonStyle = {
    backgroundColor: profile.buttonColor,
    color: profile.buttonTextColor,
  };

  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden ring-4 ring-black/10">
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[24px] w-[120px] bg-gray-900 rounded-b-2xl z-20"></div>

      {/* Screen Content */}
      <div 
        className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col items-center py-12 px-4 transition-colors duration-300"
        style={containerStyle}
      >
        <div className="mb-6 flex flex-col items-center text-center w-full">
          <div className="relative mb-4">
            {/* Corona gradient effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 blur-sm opacity-70 scale-[1.03] animate-pulse" />
            <Avatar className="relative w-20 h-20 border-2 shadow-lg" style={{ borderColor: 'white' }}>
              <AvatarImage src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
              <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          {profile.showUsername && (
            <p className="text-xs opacity-70 mb-1">@{profile.username}</p>
          )}
          {profile.displayName && (
            <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: '#000000' }}>{profile.displayName}</h2>
          )}
          {profile.bio && (() => {
            const lines = profile.bio.split('\n');
            const tagline = lines[0];
            const description = lines.slice(1).join('\n').trim();
            return (
              <>
                {tagline && <p className="text-xs opacity-90 leading-relaxed whitespace-nowrap" style={{ color: '#000000' }}>{tagline}</p>}
                {description && <p className="text-xs opacity-90 max-w-[85%] leading-relaxed mt-1" style={{ color: '#636363' }}>{description}</p>}
              </>
            );
          })()}
        </div>

        <div className="w-full space-y-3 flex-1">
          {links?.filter(l => l.isVisible).map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-3 group",
              )}
              style={buttonStyle}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-500">{getLinkIcon(link.url, link.title, link.icon)}</span>
              <span className="truncate flex-1 text-left">{link.title}</span>
            </a>
          ))}
          {(!links || links.length === 0) && (
            <div className="text-center p-4 border-2 border-dashed border-current/20 rounded-xl opacity-50 text-xs">
              Add links to see them here
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 pb-2">
           <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest flex items-center gap-1">
             Bio Linker
           </span>
        </div>
      </div>
    </div>
  );
}
