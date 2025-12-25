import { useAuth } from "@/hooks/use-auth";
import { useProfile, useCreateProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useLinks, useCreateLink, useReorderLinks } from "@/hooks/use-links";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2, Plus, LogOut, LayoutGrid, Palette, Globe, ExternalLink, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Components
import { LinkItem } from "@/components/LinkItem";
import { PhonePreview } from "@/components/PhonePreview";
import { ColorPicker } from "@/components/ColorPicker";
import { useToast } from "@/hooks/use-toast";

const createProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, dashes and underscores"),
});

const createLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
});

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: links, isLoading: linksLoading } = useLinks();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("links");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);

  // Mutations
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const createLink = useCreateLink();
  const reorderLinks = useReorderLinks();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  // Copy link handler
  const copyLink = () => {
    if (profile) {
      const url = `${window.location.origin}/public/${profile.username}`;
      navigator.clipboard.writeText(url);
      toast({ title: "Copied!", description: "Profile URL copied to clipboard." });
    }
  };

  // Forms
  const profileForm = useForm<z.infer<typeof createProfileSchema>>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: { username: "" },
  });

  const linkForm = useForm<z.infer<typeof createLinkSchema>>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { title: "", url: "" },
  });

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && links) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over?.id);
      
      const newOrder = arrayMove(links, oldIndex, newIndex);
      reorderLinks.mutate(newOrder.map(l => l.id));
    }
  };

  if (authLoading || profileLoading || linksLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no profile, show create profile dialog
  if (!profile && !profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
            <p className="text-muted-foreground">Let's pick a username to get started.</p>
          </div>
          
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit((data) => createProfile.mutate(data))} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="flex rounded-lg shadow-sm">
                        <span className="px-3 inline-flex items-center border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                          biolinker.app/
                        </span>
                        <Input {...field} className="rounded-l-none" placeholder="yourname" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={createProfile.isPending}>
                {createProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Claim Username
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-40 h-16">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-primary">
            <LayoutGrid className="w-6 h-6" />
            <span>Dashboard</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
              <a href={`/public/${profile?.username}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </a>
            </Button>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={() => logout()} disabled={authLoading}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Editor Column */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-white border shadow-sm">
                <TabsTrigger value="links" className="gap-2">
                  <LayoutGrid className="w-4 h-4" /> Links
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2">
                  <Palette className="w-4 h-4" /> Appearance
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Globe className="w-4 h-4" /> Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="links" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
                 <Button 
                   size="lg" 
                   className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform"
                   onClick={() => setIsAddLinkOpen(true)}
                 >
                   <Plus className="mr-2 w-5 h-5" /> Add New Link
                 </Button>
              </div>

              {links && links.length > 0 ? (
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={links.map(l => l.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {links.map((link) => (
                        <LinkItem key={link.id} link={link} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                  <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">No links yet</h3>
                  <p className="text-muted-foreground text-sm">Add your first link to get started!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="appearance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border shadow-sm divide-y">
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Profile</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Display Name</label>
                      <Input 
                        placeholder="Your full name" 
                        defaultValue={profile?.displayName || ""}
                        onBlur={(e) => {
                          if (e.target.value !== profile?.displayName) {
                            updateProfile.mutate({ displayName: e.target.value || null });
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show @username</label>
                      <input 
                        type="checkbox"
                        checked={profile?.showUsername ?? true}
                        onChange={(e) => {
                          updateProfile.mutate({ showUsername: e.target.checked });
                        }}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea 
                        placeholder="Tell the world about yourself..." 
                        defaultValue={profile?.bio || ""}
                        onBlur={(e) => {
                          if (e.target.value !== profile?.bio) {
                            updateProfile.mutate({ bio: e.target.value });
                          }
                        }}
                        className="resize-none min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">Tip: First line will be shown as your tagline in a larger size.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Theme</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ColorPicker 
                      label="Background Color" 
                      color={profile?.backgroundColor || "#ffffff"} 
                      onChange={(c) => updateProfile.mutate({ backgroundColor: c })} 
                    />
                    <ColorPicker 
                      label="Text Color" 
                      color={profile?.textColor || "#000000"} 
                      onChange={(c) => updateProfile.mutate({ textColor: c })} 
                    />
                    <ColorPicker 
                      label="Button Color" 
                      color={profile?.buttonColor || "#000000"} 
                      onChange={(c) => updateProfile.mutate({ buttonColor: c })} 
                    />
                    <ColorPicker 
                      label="Button Text" 
                      color={profile?.buttonTextColor || "#ffffff"} 
                      onChange={(c) => updateProfile.mutate({ buttonTextColor: c })} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                 <h3 className="font-bold text-lg mb-4">Account Settings</h3>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Username</label>
                     <div className="flex gap-2">
                        <Input value={profile?.username} disabled className="bg-secondary/20" />
                        <Button variant="outline" size="icon" disabled>
                          <Copy className="w-4 h-4" />
                        </Button>
                     </div>
                     <p className="text-xs text-muted-foreground">Usernames cannot be changed once set.</p>
                   </div>
                 </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Column */}
        <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)]">
          <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-3xl border shadow-sm">
             <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Preview
             </div>
             <div className="scale-90 xl:scale-100 transition-transform">
               <PhonePreview profile={profile || null} links={links || []} />
             </div>
          </div>
        </div>
      </main>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <Form {...linkForm}>
            <form 
              onSubmit={linkForm.handleSubmit((data) => {
                createLink.mutate(data, {
                  onSuccess: () => {
                    setIsAddLinkOpen(false);
                    linkForm.reset();
                  }
                });
              })} 
              className="space-y-4"
            >
              <FormField
                control={linkForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. My Portfolio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={linkForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={createLink.isPending}>
                {createLink.isPending ? "Adding..." : "Add Link"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
