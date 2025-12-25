import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check, Layout, Palette, Zap } from "lucide-react";
import { useEffect } from "react";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-foreground">BioLinker</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => window.location.href = "/api/login"}>
              Log in
            </Button>
            <Button onClick={() => window.location.href = "/api/login"}>
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 max-w-4xl mx-auto">
              One link to <span className="text-gradient">rule them all</span>.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Consolidate your digital presence into a single, beautiful page. Share your content, grow your audience, and track your success.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => window.location.href = "/api/login"}>
                Create your Bio Link <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-32 bottom-0 w-full" />
              <div className="glass-panel rounded-t-3xl border-b-0 p-4 pb-0 mx-auto max-w-4xl">
                 <img 
                   src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop" 
                   alt="Dashboard Preview" 
                   className="rounded-t-2xl w-full shadow-2xl opacity-90"
                 />
                 {/* Decorative overlay */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-2xl p-8 text-white text-center">
                    <p className="font-bold text-2xl mb-2">Join thousands of creators</p>
                    <p className="opacity-80">Sign up in seconds.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Layout className="w-8 h-8 text-blue-500" />}
                title="Easy Builder"
                description="Drag and drop links, add social icons, and organize your content in seconds."
              />
              <FeatureCard 
                icon={<Palette className="w-8 h-8 text-purple-500" />}
                title="Custom Themes"
                description="Match your brand with custom colors, fonts, and styles. Make it truly yours."
              />
              <FeatureCard 
                icon={<Zap className="w-8 h-8 text-yellow-500" />}
                title="Instant Updates"
                description="Changes go live immediately. No deployment, no waiting. Just magic."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BioLinker. Built with ❤️.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 bg-secondary/50 w-16 h-16 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
