import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Globe, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Link, UpdateLinkRequest } from "@shared/schema";
import { useUpdateLink, useDeleteLink } from "@/hooks/use-links";

interface LinkItemProps {
  link: Link;
}

export function LinkItem({ link }: LinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();
  const [isExpanded, setIsExpanded] = useState(false);

  // Local state for instant feedback while typing
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

  const handleBlur = () => {
    if (title !== link.title || url !== link.url) {
      updateLink.mutate({ id: link.id, title, url });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3 group">
      <Card className="p-0 overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-white">
        <div className="flex items-center p-4 gap-4">
          <button 
            {...attributes} 
            {...listeners} 
            className="text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="font-semibold text-foreground truncate">{title}</div>
            <div className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {url}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch 
              checked={link.isVisible} 
              onCheckedChange={(checked) => updateLink.mutate({ id: link.id, isVisible: checked })}
              className="data-[state=checked]:bg-primary"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteLink.mutate(link.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 pt-0 border-t bg-muted/20 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  onBlur={handleBlur}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</label>
                <Input 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  onBlur={handleBlur}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
