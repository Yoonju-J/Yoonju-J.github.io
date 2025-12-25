import { usePublicProfile } from "@/hooks/use-profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

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
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
            <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-2">@{profile.username}</h1>
          {profile.bio && (
             <p className="text-lg opacity-90 max-w-sm leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {links.filter(l => l.isVisible).map((link, i) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 rounded-xl text-center font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-between group animate-in slide-in-from-bottom-4 fill-mode-backwards"
              style={{ 
                backgroundColor: profile.buttonColor,
                color: profile.buttonTextColor,
                animationDelay: `${i * 100}ms`
              }}
            >
              <span className="w-6" /> {/* Spacer */}
              <span className="flex-1 px-2 truncate">{link.title}</span>
              <ExternalLink className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
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
