"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Visibility = "INTERNAL" | "PUBLIC";

type EventApiResponse = {
  id: string;
  title: string;
  description: string;
  slug: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number | string;
  visibility: Visibility;
  imageUrl?: string | null;
};

function toLocalDateTimeInput(iso: string) {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export default function EditOrganiserEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [seats, setSeats] = useState("100");
  const [amount, setAmount] = useState("0");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && slug.trim().length >= 3 && !submitting;
  }, [title, slug, submitting]);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/event/${id}`, { cache: "no-store" });
        const event: EventApiResponse = await response.json();

        if (!response.ok) {
          setErrorMessage("Failed to load event for editing.");
          return;
        }

        setTitle(event.title ?? "");
        setDescription(event.description ?? "");
        setSlug(event.slug ?? "");
        setStartDatetime(toLocalDateTimeInput(event.startDatetime));
        setEndDatetime(toLocalDateTimeInput(event.endDatetime));
        setSeats(String(event.seats ?? 0));
        setAmount(String(event.amount ?? 0));
        setVisibility(event.visibility ?? "PUBLIC");
        setImageUrl(event.imageUrl ?? "");
        setImagePreview(event.imageUrl ?? "");
      } catch {
        setErrorMessage("Unable to load event data.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImageName("");
      setImagePreview(imageUrl);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMessage("Image must be 5MB or smaller.");
      return;
    }

    try {
      const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      setImageFile(file);
      setImageName(file.name);
      setImagePreview(preview);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not read the image file.");
    }
  };

  const uploadImageAndGetUrl = async (file: File) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(`${apiBase}/api/upload-image`, {
      method: "POST",
      body: formData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadResult?.imageUrl) {
      throw new Error(uploadResult?.error ?? "Failed to upload image.");
    }

    return String(uploadResult.imageUrl);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setErrorMessage("");

    const parsedSeats = Number(seats);
    const parsedAmount = Number(amount);
    const start = new Date(startDatetime);
    const end = new Date(endDatetime);

    if (Number.isNaN(parsedSeats) || parsedSeats <= 0 || !Number.isInteger(parsedSeats)) {
      setErrorMessage("Seats must be a positive whole number.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setErrorMessage("Amount must be zero or greater.");
      return;
    }

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      setErrorMessage("End date/time must be after start date/time.");
      return;
    }

    setSubmitting(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const nextImageUrl = imageFile ? await uploadImageAndGetUrl(imageFile) : imageUrl;

      const response = await fetch(`${apiBase}/api/event/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          slug: slugify(slug || title),
          startDatetime: start.toISOString(),
          endDatetime: end.toISOString(),
          seats: parsedSeats,
          amount: parsedAmount,
          visibility,
          imageUrl: nextImageUrl.trim() || null,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result?.error ?? "Failed to update event.");
        return;
      }

      router.push("/organiser/dashboard");
    } catch {
      setErrorMessage("Unable to update event right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading event editor...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>
            After saving, this event will be marked as pending and needs admin approval again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  id="description"
                  className="h-32 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="startDatetime">Start Date Time</FieldLabel>
                  <Input
                    id="startDatetime"
                    type="datetime-local"
                    value={startDatetime}
                    onChange={(e) => setStartDatetime(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="endDatetime">End Date Time</FieldLabel>
                  <Input
                    id="endDatetime"
                    type="datetime-local"
                    value={endDatetime}
                    onChange={(e) => setEndDatetime(e.target.value)}
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="seats">Seats</FieldLabel>
                  <Input id="seats" type="number" min={1} step={1} value={seats} onChange={(e) => setSeats(e.target.value)} required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="amount">Amount</FieldLabel>
                  <Input id="amount" type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </Field>

                <Field>
                  <FieldLabel>Visibility</FieldLabel>
                  <Select value={visibility} onValueChange={(value) => setVisibility(value as Visibility)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                      <SelectItem value="INTERNAL">INTERNAL</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="imageUpload">Upload New Image (optional)</FieldLabel>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                />
                {imageName ? <p className="text-xs text-muted-foreground">Selected: {imageName}</p> : null}
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="mt-2 max-h-44 rounded-md border border-border object-cover"
                  />
                ) : null}
              </Field>
            </FieldGroup>

            {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
