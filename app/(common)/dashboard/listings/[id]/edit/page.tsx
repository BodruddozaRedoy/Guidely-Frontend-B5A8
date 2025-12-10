/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function EditTourPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);

  // ---------- FORM STATE ----------
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tourFee: "",
    durationDays: "",
    maxGroupSize: "",
    meetingPoint: "",
    category: "",
    city: "",
    country: "",
  });

  const [itinerary, setItinerary] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  // ------------------------------------------------------
  // LOAD EXISTING LISTING
  // ------------------------------------------------------
  const fetchListing = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/listings/${id}`);
      const result = await res.json();

      if (!res.ok) {
        toast.error("Unable to load listing");
        return;
      }

      const l = result.data;

      // Prefill form
      setFormData({
        title: l.title,
        description: l.description,
        tourFee: String(l.tourFee),
        durationDays: String(l.durationDays),
        maxGroupSize: String(l.maxGroupSize),
        meetingPoint: l.meetingPoint || "",
        category: l.category,
        city: l.city,
        country: l.country || "",
      });

      setImages(l.images || []);
      setItinerary(
        l.itinerary
          ? l.itinerary.split("|").map((i: string) => i.trim())
          : [""]
      );

      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Error loading listing");
    }
  };

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  // ------------------------------------------------------
  // FORM HANDLERS
  // ------------------------------------------------------
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItineraryChange = (i: number, v: string) => {
    const updated = [...itinerary];
    updated[i] = v;
    setItinerary(updated);
  };

  const addItinerary = () => setItinerary([...itinerary, ""]);
  const removeItinerary = (i: number) =>
    setItinerary(itinerary.filter((_, idx) => idx !== i));

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = (i: number) =>
    setImages(images.filter((_, idx) => idx !== i));

  // ------------------------------------------------------
  // SUBMIT UPDATE
  // ------------------------------------------------------
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      itinerary: itinerary.join(" | "),
      tourFee: Number(formData.tourFee),
      durationDays: Number(formData.durationDays),
      meetingPoint: formData.meetingPoint,
      maxGroupSize: Number(formData.maxGroupSize),
      city: formData.city,
      country: formData.country,
      category: formData.category,
      images,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Update failed");
        return;
      }

      toast.success("Tour updated successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // ------------------------------------------------------
  // LOADING STATE
  // ------------------------------------------------------
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading tour...</p>
      </div>
    );

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="font-display font-bold text-3xl">Edit Tour</h1>
        <p className="text-muted-foreground mb-6">
          Modify the fields below to update your tour listing.
        </p>

        <form onSubmit={handleUpdate} className="max-w-3xl space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-soft space-y-6">

            {/* Title */}
            <div>
              <Label>Tour Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                rows={4}
                onChange={handleChange}
              />
            </div>

            {/* Category + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.icon} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>City</Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Country */}
            <div>
              <Label>Country</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tour Fee ($)</Label>
                <Input
                  name="tourFee"
                  type="number"
                  value={formData.tourFee}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Duration Days</Label>
                <Input
                  name="durationDays"
                  type="number"
                  value={formData.durationDays}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Max Group Size</Label>
                <Input
                  name="maxGroupSize"
                  type="number"
                  value={formData.maxGroupSize}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Meeting Point */}
            <div>
              <Label>Meeting Point</Label>
              <Input
                name="meetingPoint"
                value={formData.meetingPoint}
                onChange={handleChange}
              />
            </div>

            {/* Itinerary */}
            <div>
              <Label className="mb-2 block">Itinerary</Label>
              {itinerary.map((step, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={step}
                    onChange={(e) => handleItineraryChange(i, e.target.value)}
                    placeholder={`Step ${i + 1}`}
                  />
                  {itinerary.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItinerary(i)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addItinerary}
                className="mt-2"
              >
                <Plus className="w-4 h-4" /> Add Step
              </Button>
            </div>

            {/* Images */}
            <div>
              <Label className="mb-2 block">Images</Label>

              <div className="flex gap-2 mb-3">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <Upload className="w-4 h-4" /> Add
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <Image
                      src={img}
                      alt="Image"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover h-24"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                      onClick={() => removeImage(i)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="flex-1">
                Update Tour
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
