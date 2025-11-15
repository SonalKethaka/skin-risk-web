// // src/app/page.tsx
// "use client";

// import React, { useRef, useState } from "react";
// import Image from "next/image";
// import { Button } from "@heroui/react";

// type PredictionResult = {
//   label: string;
//   confidence: number;
//   details?: string;
// };

// const Home: React.FC = () => {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSkinPhotoClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setSelectedFile(file);
//     setResult(null);
//     setError(null);

//     const url = URL.createObjectURL(file);
//     setPreviewUrl((old) => {
//       if (old) URL.revokeObjectURL(old);
//       return url;
//     });
//   };

//   const handleTryDetection = async () => {
//     if (!selectedFile) {
//       setError("Please upload a skin photo first.");
//       return;
//     }

//     try {
//       setIsDetecting(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       const res = await fetch("/api/predict", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error("Analysis failed. Please try again.");
//       }

//       const data = await res.json();

//       setResult({
//         label: data.label ?? data.prediction ?? "Unknown",
//         confidence:
//           typeof data.confidence === "number"
//             ? data.confidence
//             : typeof data.probability === "number"
//             ? data.probability
//             : 0,
//         details:
//           data.details ??
//           data.message ??
//           "This is an AI-based preliminary assessment. Please consult a dermatologist for medical advice.",
//       });
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsDetecting(false);
//     }
//   };

//   const confidencePercent = result ? (result.confidence * 100).toFixed(1) : null;

//   return (
//     <main className="min-h-screen bg-white text-neutral-900">
//       {/* HERO WITH BACKGROUND IMAGE */}
//       <section className="relative h-[360px] w-full overflow-hidden">
//         <Image
//           src="/backgrounds/home.jpg" // your hero image in /public
//           alt="Dermatologist examining skin"
//           fill
//           priority
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40" />

//         {/* Buttons anchored to bottom of hero */}
//         <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-6 md:px-8">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex items-center gap-4 bg-black/40 py-3 px-5 rounded-full">
//               <button
//                 type="button"
//                 onClick={handleSkinPhotoClick}
//                 className="flex items-center gap-2 rounded-full bg-emerald-900/90 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 transition"
//               >
//                 Skin Photo
//               </button>
//               <p className="hidden text-sm text-white/80 sm:block">
//                 Upload a photo of the skin area you want to check
//               </p>
//             </div>

//             <Button
//               color="primary"
//               onPress={handleTryDetection}
//               isDisabled={!selectedFile || isDetecting}
//               className="rounded-full bg-emerald-800 px-6 font-semibold text-white shadow-lg hover:bg-emerald-700"
//             >
//               {isDetecting ? "Analyzing…" : "Try Detection"}
//             </Button>
//           </div>
//         </div>

//         {/* Hidden file input */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileChange}
//         />
//       </section>

//       {/* PREVIEW + RESULT AREA (BELOW HERO) */}
//       <section className="relative z-20 mx-auto mt-10 mb-12 max-w-5xl px-4 md:px-0 space-y-4">
//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {/* Preview card – only when an image is uploaded */}
//         {previewUrl && (
//           <div className="rounded-3xl border-1 border-neutral-200 bg-neutral-50 py-6 shadow-lg">
//             <div className="grid items-center gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
//               <div className="flex justify-center">
//                 <div className="relative h-60 mx-6 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-black">
//                   <Image
//                     src={previewUrl}
//                     alt="Selected skin photo"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               </div>
//               <div className="text-neutral-800 mx-6">
//                 <p className="mb-2 text-lg font-semibold text-neutral-900">
//                   Important
//                 </p>
//                 <p className="mb-2 text-sm">
//                   SafeSkin does not store your images permanently. They are
//                   processed securely and used only for this analysis session.
//                 </p>
//                 <p className="text-xs text-neutral-600">
//                   For best results, use a well-lit, close-up photo of the mole or
//                   skin area. Avoid heavy filters, strong shadows, or motion blur.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Result card (still between hero and heading) */}
//         {result && (
//           <div
//           className={`rounded-2xl border p-5 shadow-lg ${
//             result.label.toLowerCase().includes("benign")
//               ? "border-emerald-100 bg-emerald-50/40"
//               : "border-red-200 bg-red-50/40"
//           }`}
//         >
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <p
//                 className={`text-md font-semibold uppercase ${
//                   result.label.toLowerCase().includes("benign")
//                     ? "text-emerald-700"
//                     : "text-red-700"
//                 }`}
//               >
//                 AI Screening Result
//               </p>

//               <p
//                 className={`text-lg font-semibold ${
//                   result.label.toLowerCase().includes("benign")
//                     ? "text-emerald-900"
//                     : "text-red-900"
//                 }`}
//               >
//                 {result.label}
//               </p>
//             </div>

//             {confidencePercent && (
//               <div className="text-right">
//                 <p className="text-xs text-neutral-500">Confidence</p>

//                 <p
//                   className={`text-xl font-bold ${
//                     result.label.toLowerCase().includes("benign")
//                       ? "text-emerald-700"
//                       : "text-red-700"
//                   }`}
//                 >
//                   {confidencePercent}%
//                 </p>
//           </div>
//       )}
//         </div>

//     {result.details && (
//       <p className="mt-3 text-sm leading-relaxed text-neutral-700">
//         {result.details}
//       </p>
//     )}

//     <p className="mt-3 text-xs text-neutral-600">
//       This tool provides a preliminary assessment only and does not replace a
//       professional medical diagnosis. Always consult a dermatologist if you
//       notice changes or feel concerned.
//     </p>
//   </div>
//         )}
//       </section>

//       {/* WHAT IS SKIN CANCER SECTION */}
//       <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 md:px-0">
//         <h2 className="mb-6 text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
//           What is{" "}
//           <span className="font-bold tracking-wide text-emerald-800">
//             SKIN CANCER
//           </span>
//         </h2>

//         <div className="space-y-4 text-sm leading-relaxed text-neutral-800 md:text-base">
//           <p>
//             Skin cancer occurs when abnormal skin cells grow uncontrollably, often
//             caused by damage to their DNA from ultraviolet (UV) radiation. These cells
//             form visible or hidden lesions that may appear as new growths, moles, or
//             patches on the skin. Areas frequently exposed to sunlight such as the
//             face, neck, arms, and hands are at higher risk.
//           </p>
//           <p>
//             Early diagnosis is crucial. When detected in its initial stages, skin
//             cancer can be treated effectively with minimal medical intervention.
//             Regular self-examinations and timely screenings help identify warning
//             signs before they progress.
//           </p>
//           <p>
//             SafeSkin helps you spot potential warning signs by analyzing uploaded skin
//             images using machine-learning models. Within seconds, it provides a
//             preliminary report and confidence score to support your decision on
//             whether to seek professional evaluation.
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Home;
// src/app/page.tsx
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

type PredictionResult = {
  label: string;
  confidence: number;
  details?: string;
};

const Home: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // history saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const { user } = useAuth();

  const handleSkinPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setResult(null);
    setError(null);
    setSaveMessage(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  const handleTryDetection = async () => {
    if (!selectedFile) {
      setError("Please upload a skin photo first.");
      return;
    }

    try {
      setIsDetecting(true);
      setError(null);
      setSaveMessage(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await res.json();

      setResult({
        label: data.label ?? data.prediction ?? "Unknown",
        confidence:
          typeof data.confidence === "number"
            ? data.confidence
            : typeof data.probability === "number"
            ? data.probability
            : 0,
        details:
          data.details ??
          data.message ??
          "This is an AI-based preliminary assessment. Please consult a dermatologist for medical advice.",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  const confidencePercent = result ? (result.confidence * 100).toFixed(1) : null;
  const isBenign =
    result && result.label.toLowerCase().includes("benign");

  const handleSaveToHistory = async () => {
    if (!user) {
      setError("Please log in to save this result to your history.");
      return;
    }
    if (!selectedFile || !result) {
      setError("Run a detection before saving to history.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSaveMessage(null);

      // 1) upload image to Supabase Storage
      const ext = selectedFile.name.split(".").pop() || "jpg";
      const filePath = `${user.uid}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("skin-images")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type || "image/jpeg",
        });

      if (uploadError) {
        console.error(uploadError);
        throw new Error("Failed to upload image to history.");
      }

      // 2) public URL
      const { data: publicData } = supabase.storage
        .from("skin-images")
        .getPublicUrl(filePath);

      const imageUrl = publicData.publicUrl;

      // 3) insert row into history table
      const { error: insertError } = await supabase.from("history").insert({
        user_id: user.uid,
        image_url: imageUrl,
        label: result.label,
        confidence: result.confidence,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error(insertError);
        throw new Error("Failed to save result to history.");
      }

      setSaveMessage("Saved to your history.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not save to history.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* HERO WITH BACKGROUND IMAGE */}
      <section className="relative h-[360px] w-full overflow-hidden">
        <Image
          src="/backgrounds/home.jpg"
          alt="Dermatologist examining skin"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Buttons anchored to bottom of hero */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-6 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-black/40 py-3 px-5 rounded-full">
              <button
                type="button"
                onClick={handleSkinPhotoClick}
                className="flex items-center gap-2 rounded-full bg-emerald-900/90 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 transition"
              >
                Skin Photo
              </button>
              <p className="hidden text-sm text-white/80 sm:block">
                Upload a photo of the skin area you want to check
              </p>
            </div>

            <Button
              color="primary"
              onPress={handleTryDetection}
              isDisabled={!selectedFile || isDetecting}
              className="rounded-full bg-emerald-800 px-6 font-semibold text-white shadow-lg hover:bg-emerald-700"
            >
              {isDetecting ? "Analyzing…" : "Try Detection"}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </section>

      {/* PREVIEW + RESULT AREA (BELOW HERO) */}
      <section className="relative z-20 mx-auto mt-10 mb-12 max-w-5xl px-4 md:px-0 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Preview card – only when an image is uploaded */}
        {previewUrl && (
          <div className="rounded-3xl border-1 border-neutral-200 bg-neutral-50 py-6 shadow-lg">
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
              <div className="flex justify-center">
                <div className="relative h-60 mx-6 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-black">
                  <Image
                    src={previewUrl}
                    alt="Selected skin photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-neutral-800 mx-6">
                <p className="mb-2 text-lg font-semibold text-neutral-900">
                  Important
                </p>
                <p className="mb-2 text-sm">
                  SafeSkin does not store your images permanently, unless you
                  choose to save them to your history.
                </p>
                <p className="text-xs text-neutral-600">
                  For best results, use a well-lit, close-up photo of the mole or
                  skin area. Avoid heavy filters, strong shadows, or motion blur.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div
            className={`rounded-2xl border p-5 shadow-lg ${
              isBenign
                ? "border-emerald-100 bg-emerald-50/40"
                : "border-red-200 bg-red-50/40"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p
                  className={`text-md font-semibold uppercase ${
                    isBenign ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  AI Screening Result
                </p>

                <p
                  className={`text-lg font-semibold ${
                    isBenign ? "text-emerald-900" : "text-red-900"
                  }`}
                >
                  {result.label}
                </p>
              </div>

              {confidencePercent && (
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Confidence</p>

                  <p
                    className={`text-xl font-bold ${
                      isBenign ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {confidencePercent}%
                  </p>
                </div>
              )}
            </div>

            {result.details && (
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                {result.details}
              </p>
            )}

            <p className="mt-3 text-xs text-neutral-600">
              This tool provides a preliminary assessment only and does not replace a
              professional medical diagnosis. Always consult a dermatologist if you
              notice changes or feel concerned.
            </p>

            <div className="mt-4 flex items-center justify-end gap-3">
              {saveMessage && (
                <span className="text-xs text-emerald-700">{saveMessage}</span>
              )}
              <button
                type="button"
                onClick={handleSaveToHistory}
                disabled={isSaving || !user}
                className={`rounded-full px-4 py-2 text-xs font-medium shadow
                  ${
                    isSaving || !user
                      ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
              >
                {isSaving
                  ? "Saving..."
                  : user
                  ? "Save to my history"
                  : "Log in to save"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* WHAT IS SKIN CANCER SECTION */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 md:px-0">
        <h2 className="mb-6 text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
          What is{" "}
          <span className="font-bold tracking-wide text-emerald-800">
            SKIN CANCER
          </span>
        </h2>

        <div className="space-y-4 text-sm leading-relaxed text-neutral-800 md:text-base">
          <p>
            Skin cancer occurs when abnormal skin cells grow uncontrollably, often
            caused by damage to their DNA from ultraviolet (UV) radiation. These cells
            form visible or hidden lesions that may appear as new growths, moles, or
            patches on the skin. Areas frequently exposed to sunlight such as the
            face, neck, arms, and hands are at higher risk.
          </p>
          <p>
            Early diagnosis is crucial. When detected in its initial stages, skin
            cancer can be treated effectively with minimal medical intervention.
            Regular self-examinations and timely screenings help identify warning
            signs before they progress.
          </p>
          <p>
            SafeSkin helps you spot potential warning signs by analyzing uploaded skin
            images using machine-learning models. Within seconds, it provides a
            preliminary report and confidence score to support your decision on
            whether to seek professional evaluation.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;