import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Sparkles, Users, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        navigate("/map");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate("/map");
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Discover hidden gems and famous landmarks" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Discover Your Next
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Explore famous landmarks and hidden local gems all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/role-selection")}
              className="text-lg px-8 py-6"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Start Exploring
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose Local Secrets Pro?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hidden Gems</h3>
            <p className="text-muted-foreground">
              Discover secret spots that only locals know about, from cozy cafes to breathtaking viewpoints.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-hover rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Famous Landmarks</h3>
            <p className="text-muted-foreground">
              Access comprehensive information about all the must-see attractions and iconic locations.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Join developers who contribute new places and help travelers discover authentic experiences.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-hover text-white">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Explore?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of explorers discovering amazing places around the world
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate("/role-selection")}
            className="text-lg px-8 py-6"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
