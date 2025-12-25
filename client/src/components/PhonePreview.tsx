import type { Profile, Link } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <Avatar className="w-20 h-20 mb-4 border-2 shadow-lg" style={{ borderColor: profile.buttonColor }}>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
            <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {profile.displayName && (
            <h2 className="text-lg font-bold tracking-tight mb-0.5">{profile.displayName}</h2>
          )}
          {profile.showUsername && (
            <p className="text-sm opacity-70 mb-1">@{profile.username}</p>
          )}
          {profile.bio && (() => {
            const lines = profile.bio.split('\n');
            const tagline = lines[0];
            const description = lines.slice(1).join('\n').trim();
            return (
              <>
                {tagline && <p className="text-sm opacity-90 max-w-[85%] leading-relaxed" style={{ color: '#000000' }}>{tagline}</p>}
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
                "block w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-between group",
              )}
              style={buttonStyle}
            >
              <span className="w-4" /> {/* Spacer for centering */}
              <span className="truncate flex-1 px-2">{link.title}</span>
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
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
