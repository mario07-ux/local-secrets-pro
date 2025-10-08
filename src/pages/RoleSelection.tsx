import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, Eye, ArrowLeft } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-muted-foreground">
            Select how you'd like to use Local Secrets Pro
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary group"
            onClick={() => navigate("/auth?role=developer")}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Developer</h2>
            <p className="text-muted-foreground mb-6">
              Contribute to the platform by adding new places, updating information, and helping travelers discover amazing locations.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                Add new places to the map
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                Edit existing locations
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                Manage place information
              </li>
            </ul>
            <Button variant="hero" className="w-full">
              Continue as Developer
            </Button>
          </Card>

          <Card 
            className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-secondary group"
            onClick={() => navigate("/auth?role=user")}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-hover rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Explorer</h2>
            <p className="text-muted-foreground mb-6">
              Discover and explore both famous landmarks and hidden local gems. Find your next adventure with curated recommendations.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                Browse famous landmarks
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                Discover hidden gems
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                Explore interactive map
              </li>
            </ul>
            <Button variant="secondary" className="w-full">
              Continue as Explorer
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
