import { usePublicProfile } from "@/hooks/use-profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Globe, Instagram, Twitter, Linkedin, Youtube, Github, Facebook, Mail, Link2, Music, BookOpen } from "lucide-react";
import { SiThreads, SiObsidian } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

function getLinkIcon(url: string, title: string, iconName?: string | null) {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Check title for specific matches first
  if (titleLower.includes('physical ai')) return <BookOpen className="w-5 h-5" />;
  if (titleLower.includes('threads') || urlLower.includes('threads')) return <SiThreads className="w-5 h-5" />;
  if (titleLower.includes('wiki') || urlLower.includes('obsidian')) return <SiObsidian className="w-5 h-5" />;
  
  // URL-based matching
  if (urlLower.includes('instagram')) return <Instagram className="w-5 h-5" />;
  if (urlLower.includes('twitter') || urlLower.includes('x.com')) return <Twitter className="w-5 h-5" />;
  if (urlLower.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
  if (urlLower.includes('youtube')) return <Youtube className="w-5 h-5" />;
  if (urlLower.includes('github')) return <Github className="w-5 h-5" />;
  if (urlLower.includes('facebook')) return <Facebook className="w-5 h-5" />;
  if (urlLower.includes('spotify') || urlLower.includes('music')) return <Music className="w-5 h-5" />;
  if (urlLower.includes('notion')) return <BookOpen className="w-5 h-5" />;
  if (urlLower.includes('mailto:')) return <Mail className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
}

interface PublicProfileProps {
  params: { username: string };
}

export default function PublicProfile({ params }: PublicProfileProps) {
  const { data, isLoading } = usePublicProfile(params.username);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Profile not found.</p>
        <Button onClick={() => window.location.href = "/"}>Go Home</Button>
      </div>
    );
  }

  const { profile, links } = data;

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ 
        backgroundColor: profile.backgroundColor,
        color: profile.textColor,
        fontFamily: profile.font === 'Inter' ? 'sans-serif' : profile.font,
      }}
    >
      <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 animate-in zoom-in-50 duration-500">
          <Avatar className="w-24 h-24 mb-6 border-4 shadow-xl" style={{ borderColor: profile.buttonColor }}>
            <AvatarImage src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
            <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {profile.showUsername && (
            <p className="text-lg opacity-70 mb-2">@{profile.username}</p>
          )}
          {profile.displayName && (
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>{profile.displayName}</h1>
          )}
          {profile.bio && (() => {
            const lines = profile.bio.split('\n');
            const tagline = lines[0];
            const description = lines.slice(1).join('\n').trim();
            return (
              <>
                {tagline && <p className="text-base opacity-90 leading-relaxed whitespace-nowrap" style={{ color: '#000000' }}>{tagline}</p>}
                {description && <p className="text-sm opacity-90 max-w-sm leading-relaxed whitespace-pre-wrap mt-2" style={{ color: '#636363' }}>{description}</p>}
              </>
            );
          })()}
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {links.filter(l => l.isVisible).map((link, i) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 rounded-xl text-center font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center gap-4 group animate-in slide-in-from-bottom-4 fill-mode-backwards"
              style={{ 
                backgroundColor: profile.buttonColor,
                color: profile.buttonTextColor,
                animationDelay: `${i * 100}ms`
              }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-500">{getLinkIcon(link.url, link.title, link.icon)}</span>
              <span className="flex-1 text-left truncate">{link.title}</span>
            </a>
          ))}
        </div>

        {/* Branding */}
        <div className="mt-16">
          <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100">
            <span>Powered by</span>
            <span className="text-primary font-black">BioLinker</span>
          </a>
        </div>
      </div>
    </div>
  );
}
