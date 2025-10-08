import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const placeSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().trim().max(1000).optional(),
  category: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  source: z.string().trim().max(200).optional(),
});

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

interface EditPlaceDialogProps {
  place: Place;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditPlaceDialog = ({ place, open, onOpenChange, onSuccess }: EditPlaceDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
    latitude: "",
    longitude: "",
    address: "",
    imageUrl: "",
    isFamous: false,
    source: "",
  });

  useEffect(() => {
    if (place) {
      setFormData({
        name: place.name,
        description: place.description || "",
        category: place.category,
        latitude: place.latitude.toString(),
        longitude: place.longitude.toString(),
        address: place.address || "",
        imageUrl: place.image_url || "",
        isFamous: place.is_famous,
        source: place.source || "",
      });
    }
  }, [place]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = placeSchema.parse({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address,
        imageUrl: formData.imageUrl,
        source: formData.source,
      });

      const { error } = await supabase
        .from("places")
        .update({
          name: validatedData.name,
          description: validatedData.description,
          category: validatedData.category as any,
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
          address: validatedData.address,
          image_url: validatedData.imageUrl,
          is_famous: formData.isFamous,
          source: validatedData.source,
        } as any)
        .eq("id", place.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Place updated successfully",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Place</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Place Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landmark">Landmark</SelectItem>
                  <SelectItem value="hidden_gem">Hidden Gem</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="cafe">Cafe</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-latitude">Latitude *</Label>
              <Input
                id="edit-latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-longitude">Longitude *</Label>
              <Input
                id="edit-longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-address">Address</Label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="edit-imageUrl">Image URL</Label>
            <Input
              id="edit-imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="edit-source">Source</Label>
            <Input
              id="edit-source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-isFamous"
              checked={formData.isFamous}
              onCheckedChange={(checked) => setFormData({ ...formData, isFamous: checked })}
            />
            <Label htmlFor="edit-isFamous">Famous landmark</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Place
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaceDialog;
