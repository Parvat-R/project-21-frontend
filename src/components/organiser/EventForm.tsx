"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Visibility = "INTERNAL" | "PUBLIC";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function toDateTimeLocalValue(input: Date) {
  const year = input.getFullYear();
  const month = String(input.getMonth() + 1).padStart(2, "0");
  const day = String(input.getDate()).padStart(2, "0");
  const hours = String(input.getHours()).padStart(2, "0");
  const minutes = String(input.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const STEPS = ["basics", "details", "review"] as const;
type Step = (typeof STEPS)[number];



export function EventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [startDatetime, setStartDatetime] = useState(toDateTimeLocalValue(now));
  const [endDatetime, setEndDatetime] = useState(toDateTimeLocalValue(oneHourLater));
  const [seats, setSeats] = useState("100");
  const [amount, setAmount] = useState("0");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [activeStep, setActiveStep] = useState<Step>("basics");

  const creatorId = getUser()?.userId ?? "";
  const router = useRouter();

  const canSubmit = useMemo(() => {
    return (
      title.trim().length >= 3 &&
      slugify(slug || title).length >= 3 &&
      startDatetime.length > 0 &&
      endDatetime.length > 0 &&
      !submitting
    );
  }, [title, slug, startDatetime, endDatetime, submitting]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setSlug(slugify(value));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImageName("");
      setImagePreview("");
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
    const apiBase =
      process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";
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
    setErrorMessage("");
    setSuccessMessage("");

    const parsedSeats = Number(seats);
    const parsedAmount = Number(amount);
    const start = new Date(startDatetime);
    const end = new Date(endDatetime);
    const finalSlug = slugify(slug || title);

    if (!finalSlug || finalSlug.length < 3) {
      setErrorMessage("Slug must be at least 3 characters.");
      return;
    }

    if (Number.isNaN(parsedSeats) || parsedSeats <= 0 || !Number.isInteger(parsedSeats)) {
      setErrorMessage("Seats must be a positive whole number.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setErrorMessage("Amount must be zero or greater.");
      return;
    }

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setErrorMessage("Please provide valid start and end date times.");
      return;
    }

    if (end <= start) {
      setErrorMessage("End date/time must be after start date/time.");
      return;
    }

    if (!creatorId) {
      setErrorMessage(
        "No creator ID found. Please go to your dashboard first and enter your User ID."
      );
      return;
    }

    setSubmitting(true);

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
        "http://localhost:3000";
      const uploadedImageUrl = imageFile
        ? await uploadImageAndGetUrl(imageFile)
        : undefined;

      const response = await fetch(`${apiBase}/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          slug: finalSlug,
          startDatetime: start.toISOString(),
          endDatetime: end.toISOString(),
          seats: parsedSeats,
          amount: parsedAmount,
          visibility,
          creatorId,
          imageUrl: uploadedImageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result?.error ?? "Failed to create event.");
        toast.error("Failed to create event.");
        return;
      }

      setSuccessMessage(
        `Event created successfully${result?.id ? ` (ID: ${result.id})` : ""}.`
      );
      toast.success("Event created successfully!");
      
      setTitle("");
      setDescription("");
      setSlug("");
      setSlugTouched(false);
      setSeats("100");
      setAmount("0");
      setVisibility("PUBLIC");
      setStartDatetime(toDateTimeLocalValue(new Date()));
      setEndDatetime(toDateTimeLocalValue(new Date(Date.now() + 60 * 60 * 1000)));
      setImageFile(null);
      setImageName("");
      setImagePreview("");
      
      router.push("/organiser/dashboard");
    } catch {
      setErrorMessage("Unable to reach backend. Check your API URL or backend server.");
      toast.error("Unable to reach backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const validateStepOne = () => {
    if (title.trim().length < 3) {
      setErrorMessage("Title must be at least 3 characters.");
      return false;
    }

    if (slugify(slug || title).length < 3) {
      setErrorMessage("Slug must be at least 3 characters.");
      return false;
    }

    const start = new Date(startDatetime);
    const end = new Date(endDatetime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setErrorMessage("Please provide valid start and end date times.");
      return false;
    }

    if (end <= start) {
      setErrorMessage("End date/time must be after start date/time.");
      return false;
    }

    return true;
  };

  const validateStepTwo = () => {
    const parsedSeats = Number(seats);
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedSeats) || parsedSeats <= 0 || !Number.isInteger(parsedSeats)) {
      setErrorMessage("Seats must be a positive whole number.");
      return false;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setErrorMessage("Amount must be zero or greater.");
      return false;
    }

    return true;
  };

  const goNext = () => {
    setErrorMessage("");
    const currentIndex = STEPS.indexOf(activeStep);
    if (activeStep === "basics" && !validateStepOne()) return;
    if (activeStep === "details" && !validateStepTwo()) return;
    const nextStep = STEPS[Math.min(currentIndex + 1, STEPS.length - 1)];
    setActiveStep(nextStep);
  };

  const goBack = () => {
    setErrorMessage("");
    const currentIndex = STEPS.indexOf(activeStep);
    const prevStep = STEPS[Math.max(currentIndex - 1, 0)];
    setActiveStep(prevStep);
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          {creatorId ? (
            <span className="ml-1 text-green-600">
              Creating as user <span className="font-mono">{creatorId}</span>.
            </span>
          ) : (
            <span className="ml-1 text-yellow-600">
              No User ID found — go to your dashboard and enter your User ID first.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as Step)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">1. Basics</TabsTrigger>
              <TabsTrigger value="details">2. Details</TabsTrigger>
              <TabsTrigger value="review">3. Review</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <Card className="border border-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Section 1: Event Basics</CardTitle>
                  <CardDescription>Core details and schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        minLength={3}
                        maxLength={100}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="slug">Slug</FieldLabel>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        minLength={3}
                        required
                      />
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
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card className="border border-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Section 2: Capacity, Pricing, Visibility</CardTitle>
                  <CardDescription>Set registration constraints and upload image.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Field>
                        <FieldLabel htmlFor="seats">Seats</FieldLabel>
                        <Input
                          id="seats"
                          type="number"
                          min={1}
                          step={1}
                          value={seats}
                          onChange={(e) => setSeats(e.target.value)}
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="amount">Amount</FieldLabel>
                        <Input
                          id="amount"
                          type="number"
                          min={0}
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel>Visibility</FieldLabel>
                        <Select
                          value={visibility}
                          onValueChange={(value) => setVisibility(value as Visibility)}
                        >
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
                      <FieldLabel htmlFor="imageUpload">Upload Image</FieldLabel>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleImageChange}
                      />
                      <FieldDescription>
                        Optional. File will be stored in backend <code>public/images</code>.
                      </FieldDescription>
                      {imageName ? (
                        <p className="text-xs text-muted-foreground">Selected: {imageName}</p>
                      ) : null}
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review">
              <Card className="border border-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Section 3: Review &amp; Submit</CardTitle>
                  <CardDescription>Review the final payload before creating the event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <p><span className="font-medium">Title:</span> {title || "-"}</p>
                    <p><span className="font-medium">Slug:</span> {slugify(slug || title) || "-"}</p>
                    <p><span className="font-medium">Start:</span> {startDatetime || "-"}</p>
                    <p><span className="font-medium">End:</span> {endDatetime || "-"}</p>
                    <p><span className="font-medium">Seats:</span> {seats || "-"}</p>
                    <p><span className="font-medium">Amount:</span> {amount || "-"}</p>
                    <p><span className="font-medium">Visibility:</span> {visibility}</p>
                    <p><span className="font-medium">creatorId:</span> {creatorId || "⚠️ Not set"}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium">Description</p>
                    <p className="min-h-20 rounded-md border border-border bg-muted/20 p-3 text-sm whitespace-pre-wrap">
                      {description || "-"}
                    </p>
                  </div>

                  {imagePreview ? (
                    <div>
                      <p className="mb-2 text-sm font-medium">Image Preview</p>
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="max-h-56 rounded-md border border-border object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No image selected.</p>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={!canSubmit}>
                      {submitting ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between">
            {activeStep !== "basics" ? (
              <Button type="button" variant="outline" onClick={goBack} disabled={submitting}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {activeStep !== "review" ? (
              <Button type="button" onClick={goNext} disabled={submitting}>
                Next
              </Button>
            ) : null}
          </div>

          {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
          {successMessage ? (
            <p className="text-sm text-green-700">{successMessage}</p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
