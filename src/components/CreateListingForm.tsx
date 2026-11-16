"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/actions/listings";
import { ListingPreview } from "@/components/ListingPreview";
import { CATEGORIES } from "@/lib/categories";
import { defaultCategoryFor, titlePlaceholderFor } from "@/lib/listing-types";
import { rememberSellerEmail, readSellerEmail } from "@/lib/seller";
import type { ListingType } from "@/lib/types";
import { photoError, uploadListingPhoto } from "@/lib/upload";
import { validateListingFields } from "@/lib/validation";

const inputClass =
  "w-full rounded-lg border border-[#ccd0d5] bg-white px-3 py-2.5 text-[15px] text-[#050505] outline-none placeholder:text-[#8a8d91] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20";
const labelClass = "mb-1.5 block text-[15px] font-semibold";

export function CreateListingForm({ listingType }: { listingType: ListingType }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(defaultCategoryFor(listingType));
  const [price, setPrice] = useState("0.00");
  const [location, setLocation] = useState("Palo Alto, CA");
  const savedEmail = useSyncExternalStore(subscribe, readSellerEmail, emptySnapshot);
  const [email, setEmail] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const contactEmail = email ?? savedEmail;
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [createdId, setCreatedId] = useState("");

  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function showPhoto(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = next ? URL.createObjectURL(next) : null;
    previewRef.current = url;
    setPreviewUrl(url);
    setFile(next);
  }

  function chooseFile(next: File | undefined) {
    if (!next) return;
    const problem = photoError(next);
    if (problem) {
      setError(problem);
      showPhoto(null);
      return;
    }
    setError("");
    showPhoto(next);
  }

  function removePhoto() {
    showPhoto(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setCreatedId("");

    const fieldError = validateListingFields({
      title,
      description,
      price,
      category,
      location,
      contactEmail,
    });
    if (fieldError) {
      setError(fieldError);
      return;
    }
    if (!file) {
      setError("Add a photo.");
      return;
    }

    setPending(true);
    setError("");
    setStatus("Uploading photo…");

    try {
      const uploaded = await uploadListingPhoto(file);
      if ("error" in uploaded) {
        setError(uploaded.error);
        return;
      }

      setStatus("Saving listing…");
      const created = await createListing({
        title,
        description,
        price,
        category,
        location,
        contactEmail: contactEmail,
        imageUrl: uploaded.imageUrl,
        imagePath: uploaded.imagePath,
        listingType,
      });

      if ("error" in created) {
        setError(created.error);
        return;
      }

      rememberSellerEmail(contactEmail);

      if (listingType === "multiple") {
        setCreatedId(created.id);
        setTitle("");
        setDescription("");
        setPrice("0.00");
        removePhoto();
        return;
      }

      router.push(`/item/${created.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the listing.");
    } finally {
      setPending(false);
      setStatus("");
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] lg:px-6">
      <form onSubmit={onSubmit} className="min-w-0">
        {listingType === "multiple" ? (
          <p className="mb-4 text-sm leading-6 text-[#65676b]">
            Publish one item at a time. The form stays open so you can list the next one.
          </p>
        ) : null}
        {createdId ? (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Listing created.{" "}
            <Link href={`/item/${createdId}`} className="font-semibold underline">
              View it
            </Link>{" "}
            or add another below.
          </div>
        ) : null}

        <label className={labelClass}>Photos</label>
        {previewUrl ? (
          <div className="relative overflow-hidden rounded-xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Selected photo" className="aspect-[4/3] w-full object-cover" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-red-500 text-lg leading-none text-white shadow"
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
        ) : (
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              chooseFile(event.dataTransfer.files?.[0]);
            }}
            className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white text-center ${
              dragOver ? "border-[#0866ff] bg-[#f5f9ff]" : "border-[#ccd0d5]"
            }`}
          >
            <UploadIcon />
            <span className="mt-2 text-[15px] font-semibold">Add photos</span>
            <span className="mt-1 text-xs text-[#65676b]">JPEG, PNG, or WebP (max 5MB)</span>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />
          </label>
        )}

        <label className={`${labelClass} mt-4`} htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={titlePlaceholderFor(listingType)}
          maxLength={120}
          required
          className={inputClass}
        />

        <label className={`${labelClass} mt-4`} htmlFor="category">
          Category *
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
          className={inputClass}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label className={`${labelClass} mt-4`} htmlFor="price">
          Price *
        </label>
        <input
          id="price"
          inputMode="decimal"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          onBlur={() => {
            const amount = Number(price);
            if (price.trim() && Number.isFinite(amount) && amount >= 0) {
              setPrice(amount.toFixed(2));
            }
          }}
          required
          className={inputClass}
        />

        <label className={`${labelClass} mt-4`} htmlFor="location">
          Location
        </label>
        <input
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          maxLength={120}
          className={inputClass}
        />

        <label className={`${labelClass} mt-4`} htmlFor="email">
          Contact Email *
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={contactEmail}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          required
          className={inputClass}
        />

        <label className={`${labelClass} mt-4`} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe your item..."
          rows={4}
          maxLength={5000}
          className={`${inputClass} resize-y`}
        />

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 h-11 w-full cursor-pointer rounded-lg bg-[#0866ff] text-[15px] font-semibold text-white hover:bg-[#0756d6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? status || "Creating…" : "Create Listing"}
        </button>
      </form>

      <ListingPreview
        title={title}
        price={price}
        category={category}
        location={location}
        email={contactEmail}
        description={description}
        imageUrl={previewUrl}
      />
    </div>
  );
}

function subscribe() {
  return () => {};
}

function emptySnapshot() {
  return "";
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#65676b]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 16V6" strokeLinecap="round" />
      <path d="m8 9 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18.5h14" strokeLinecap="round" />
    </svg>
  );
}
