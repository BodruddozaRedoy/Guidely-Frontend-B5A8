/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfileEditForm({ user, onSaved }: any) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    profilePic: user.profilePic || "",
    languages: (user.languages || []).join(", "),
    expertise: (user.expertise || []).join(", "),
    dailyRate: user.dailyRate || "",
    travelPreferences: user.travelPreferences || "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          languages: form.languages.split(",").map((l:any) => l.trim()),
          expertise: form.expertise.split(",").map((e:any) => e.trim()),
          dailyRate: Number(form.dailyRate),
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      toast.success("Profile updated successfully");

      onSaved(json.data); // update parent & AuthContext
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} />
      </div>

      {/* Bio */}
      <div>
        <Label>Bio</Label>
        <Textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="h-28"
        />
      </div>

      {/* Profile Picture */}
      <div>
        <Label>Profile Picture URL</Label>
        <Input
          name="profilePic"
          value={form.profilePic}
          onChange={handleChange}
        />
      </div>

      {/* Languages */}
      <div>
        <Label>Languages (comma separated)</Label>
        <Input
          name="languages"
          value={form.languages}
          onChange={handleChange}
        />
      </div>

      {/* Expertise */}
      <div>
        <Label>Expertise (comma separated)</Label>
        <Input
          name="expertise"
          value={form.expertise}
          onChange={handleChange}
        />
      </div>

      {/* Daily Rate */}
      <div>
        <Label>Daily Rate ($)</Label>
        <Input
          type="number"
          name="dailyRate"
          value={form.dailyRate}
          onChange={handleChange}
        />
      </div>

      {/* Travel Pref */}
      <div>
        <Label>Travel Preferences</Label>
        <Input
          name="travelPreferences"
          value={form.travelPreferences}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
