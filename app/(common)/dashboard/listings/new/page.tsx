"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/mockData";
import { ArrowLeft, Plus, X, Upload, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CreateTour() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    maxGroupSize: "",
    meetingPoint: "",
    category: "",
    location: "",
  });

  const [itinerary, setItinerary] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  if (!isAuthenticated || user?.role !== "guide") {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="font-display font-bold text-2xl mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            Only guides can create tours.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (index: number, value: string) => {
    const updated = [...itinerary];
    updated[index] = value;
    setItinerary(updated);
  };

  const addItineraryItem = () => {
    setItinerary((prev) => [...prev, ""]);
  };

  const removeItineraryItem = (index: number) => {
    if (itinerary.length > 1) {
      setItinerary((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast("Missing Required Fields",{
        description: "Please fill in all required fields.",
      });
      return;
    }

    toast("Tour Created!",{
      description: "Your tour has been created successfully.",
    });

    router.push("/dashboard");
  };

  return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <h1 className="font-display font-bold text-3xl">Create New Tour</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details to create a new tour listing.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="max-w-3xl">
            <div className="bg-card rounded-2xl p-6 shadow-soft space-y-6">

              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-lg">
                  Basic Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Hidden Gems of Downtown Walking Tour"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what travelers will experience..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4 pt-4 border-t">
                <h2 className="font-display font-semibold text-lg">
                  Pricing & Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($) *</Label>
                    <Input
                      name="price"
                      type="number"
                      min="1"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration *</Label>
                    <Input
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 4 hours"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Group Size</Label>
                    <Input
                      name="maxGroupSize"
                      type="number"
                      min="1"
                      value={formData.maxGroupSize}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Meeting Point</Label>
                  <Input
                    name="meetingPoint"
                    placeholder="e.g., Main Square Fountain"
                    value={formData.meetingPoint}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-4 pt-4 border-t">
                <h2 className="font-display font-semibold text-lg">
                  Itinerary
                </h2>

                <p className="text-sm text-muted-foreground">
                  Add the steps of your tour experience.
                </p>

                <div className="space-y-3">
                  {itinerary.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="w-6 h-10 flex items-center justify-center text-muted-foreground">
                        {index + 1}.
                      </span>

                      <Input
                        placeholder={`Step ${index + 1}`}
                        value={item}
                        onChange={(e) =>
                          handleItineraryChange(index, e.target.value)
                        }
                      />

                      {itinerary.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeItineraryItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItineraryItem}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4 pt-4 border-t">
                <h2 className="font-display font-semibold text-lg">Images</h2>

                <p className="text-sm text-muted-foreground">
                  Add image URLs to showcase your tour.
                </p>

                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImage}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Add
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={img}
                          alt="Tour Image"
                          width={300}
                          height={200}
                          className="w-full h-24 object-cover rounded-lg"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6 border-t">
                <Button type="submit" className="flex-1">
                  Create Tour
                </Button>

                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}
