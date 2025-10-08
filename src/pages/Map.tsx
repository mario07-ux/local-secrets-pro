import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PlacesList from "@/components/PlacesList";
import AddPlaceDialog from "@/components/AddPlaceDialog";

const Map = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAddPlace, setShowAddPlace] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/");
      } else {
        setUser(session.user);
        fetchUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/");
      } else {
        setUser(session.user);
        fetchUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (data) {
      setUserRole(data.role);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Local Secrets Pro
              </h1>
              <p className="text-sm text-muted-foreground">
                {userRole === "developer" ? "Developer Dashboard" : "Explorer Mode"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {userRole === "developer" && (
                <Button onClick={() => setShowAddPlace(true)} variant="hero">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Place
                </Button>
              )}
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PlacesList userRole={userRole} />
      </main>

      {userRole === "developer" && (
        <AddPlaceDialog open={showAddPlace} onOpenChange={setShowAddPlace} />
      )}
    </div>
  );
};

export default Map;
