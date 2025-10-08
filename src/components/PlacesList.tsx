import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EditPlaceDialog from "./EditPlaceDialog";

interface Place {
  id: string;
  name: string;
  description: string | null;
  category: string;
  latitude: number;
  longitude: number;
  address: string | null;
  image_url: string | null;
  is_famous: boolean;
  source: string | null;
}

interface PlacesListProps {
  userRole: string | null;
}

const PlacesList = ({ userRole }: PlacesListProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load places",
        variant: "destructive",
      });
    } else {
      setPlaces(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("places")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete place",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Place deleted successfully",
      });
      fetchPlaces();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      landmark: "bg-primary text-primary-foreground",
      hidden_gem: "bg-accent text-accent-foreground",
      restaurant: "bg-secondary text-secondary-foreground",
      cafe: "bg-muted text-muted-foreground",
      nature: "bg-green-500 text-white",
      entertainment: "bg-purple-500 text-white",
      culture: "bg-blue-500 text-white",
      other: "bg-gray-500 text-white",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Discover Places</h2>
        <p className="text-muted-foreground">
          {places.length} {places.length === 1 ? "place" : "places"} to explore
        </p>
      </div>

      {places.length === 0 ? (
        <Card className="p-12 text-center">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No places yet</h3>
          <p className="text-muted-foreground">
            {userRole === "developer"
              ? "Be the first to add a place!"
              : "Check back soon for new discoveries"}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {place.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{place.name}</h3>
                    {place.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {place.address}
                      </p>
                    )}
                  </div>
                  {place.is_famous && (
                    <Star className="h-5 w-5 text-accent fill-accent" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {place.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(place.category)}>
                    {place.category.replace("_", " ")}
                  </Badge>

                  {userRole === "developer" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingPlace(place)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(place.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editingPlace && (
        <EditPlaceDialog
          place={editingPlace}
          open={!!editingPlace}
          onOpenChange={(open) => !open && setEditingPlace(null)}
          onSuccess={fetchPlaces}
        />
      )}
    </>
  );
};

export default PlacesList;
