/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const { user, isAuthenticated, token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tourFee: "",            // <-- FIXED
    durationDays: "",       // <-- FIXED
    maxGroupSize: "",
    meetingPoint: "",
    city: "",               // <-- NEW
    country: "",            // <-- NEW
    language: "",           // <-- NEW
    category: "",
  });

  const [itinerary, setItinerary] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  if (!isAuthenticated || user?.role !== "GUIDE") {
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

  // Handle inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleItineraryChange = (idx: number, value: string) => {
    const updated = [...itinerary];
    updated[idx] = value;
    setItinerary(updated);
  };

  const addItineraryItem = () => setItinerary((p) => [...p, ""]);
  const removeItineraryItem = (idx: number) =>
    itinerary.length > 1 && setItinerary(itinerary.filter((_, i) => i !== idx));

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.description || !formData.tourFee || !formData.category) {
      toast("Missing fields", {
        description: "Please fill all required fields",
      });
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      itinerary: itinerary.join(" | "), // <-- Convert array to single string
      tourFee: Number(formData.tourFee),
      durationDays: Number(formData.durationDays),
      meetingPoint: formData.meetingPoint,
      maxGroupSize: Number(formData.maxGroupSize),
      city: formData.city,
      country: formData.country,
      language: formData.language,
      category: formData.category,
      images,
      guideId: user.id, // <-- IMPORTANT
    };

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

      const res = await fetch(`${BASE_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Could not create tour");

      toast("Tour Created!", { description: "Your tour has been created successfully." });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ============================================================
  // UI (UNCHANGED DESIGN)
  // ============================================================

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

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="bg-card rounded-2xl p-6 shadow-soft space-y-6">

            {/* BASIC INFO */}
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Basic Information</h2>

              <div className="space-y-2">
                <Label>Tour Title *</Label>
                <Input
                  name="title"
                  placeholder="e.g., Hidden Gems of Dhaka"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  name="description"
                  rows={4}
                  placeholder="Describe what travelers will experience..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* CATEGORY + LOCATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, category: v }))
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

                {/* CITY */}
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    name="city"
                    placeholder="Dhaka"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* COUNTRY + LANGUAGE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    name="country"
                    placeholder="Bangladesh"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Language *</Label>
                  <Input
                    name="language"
                    placeholder="English"
                    value={formData.language}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="font-display font-semibold text-lg">Pricing & Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price ($) *</Label>
                  <Input
                    name="tourFee"
                    type="number"
                    value={formData.tourFee}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration (Days)*</Label>
                  <Input
                    name="durationDays"
                    type="number"
                    value={formData.durationDays}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Group Size</Label>
                  <Input
                    name="maxGroupSize"
                    type="number"
                    value={formData.maxGroupSize}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Meeting Point</Label>
                <Input
                  name="meetingPoint"
                  placeholder="e.g., Hatirjheel Gate"
                  value={formData.meetingPoint}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* ITINERARY */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="font-display font-semibold text-lg">Itinerary</h2>

              {itinerary.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-6 flex items-center justify-center text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Input
                    placeholder={`Step ${index + 1}`}
                    value={item}
                    onChange={(e) => handleItineraryChange(index, e.target.value)}
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

              <Button type="button" variant="outline" onClick={addItineraryItem}>
                <Plus className="w-4 h-4" /> Add Step
              </Button>
            </div>

            {/* IMAGES */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="font-display font-semibold text-lg">Images</h2>

              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <Upload className="w-4 h-4" /> Add
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={img}
                        alt=""
                        width={300}
                        height={200}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => removeImage(i)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="flex-1">Create Tour</Button>

              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
