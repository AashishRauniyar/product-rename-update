// "use client";

// import type React from "react";

// import { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useDropzone } from "react-dropzone";
// import Navbar from "@/components/navbar";

// type Product = {
//   id: string;
//   old_name: string;
//   new_name: string;
//   description: string;
//   next_redirect_url: string;
//   theme: string;
//   generated_link: string;
//   old_images: string; // JSON stringified array
//   new_images: string; // JSON stringified array
// };

// export default function EditProductPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [product, setProduct] = useState<Product | null>(null);
//   const [formData, setFormData] = useState({
//     old_name: "",
//     new_name: "",
//     description: "",
//     next_redirect_url: "",
//     theme: "light",
//   });
//   // For images: existing image URLs and new file replacements.
//   const [oldImageURLs, setOldImageURLs] = useState<string[]>([]);
//   const [newImageURLs, setNewImageURLs] = useState<string[]>([]);
//   const [oldImageFiles, setOldImageFiles] = useState<File[]>([]);
//   const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   // Fetch product details and pre-fill form data.
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${params.id}`
//         );
//         const productData = res.data;
//         setProduct(productData);

//         // Set the form data from the fetched product
//         setFormData({
//           old_name: productData.old_name || "",
//           new_name: productData.new_name || "",
//           description: productData.description || "",
//           next_redirect_url: productData.next_redirect_url || "",
//           theme: productData.theme || "light",
//         });

//         // Handle the image URLs (API already parses the JSON)
//         setOldImageURLs(
//           Array.isArray(productData.old_images) ? productData.old_images : []
//         );
//         setNewImageURLs(
//           Array.isArray(productData.new_images) ? productData.new_images : []
//         );
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setLoading(false);
//       }
//     };
//     if (params.id) {
//       fetchProduct();
//     }
//   }, [params.id]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, theme: e.target.value }));
//   };

//   // Dropzone for old images: if new file(s) are chosen, replace old images.
//   const onDropOld = useCallback((acceptedFiles: File[]) => {
//     setOldImageFiles(acceptedFiles); // Replace existing new file state.
//     setOldImageURLs([]); // Clear preserved URL(s).
//   }, []);
//   const { getRootProps: getOldRootProps, getInputProps: getOldInputProps } =
//     useDropzone({
//       onDrop: onDropOld,
//       accept: { "image/*": [] },
//       multiple: false, // Allow only one replacement image.
//     });

//   // Dropzone for new images: if new file(s) are chosen, replace new images.
//   const onDropNew = useCallback((acceptedFiles: File[]) => {
//     setNewImageFiles(acceptedFiles);
//     setNewImageURLs([]);
//   }, []);
//   const { getRootProps: getNewRootProps, getInputProps: getNewInputProps } =
//     useDropzone({
//       onDrop: onDropNew,
//       accept: { "image/*": [] },
//       multiple: false, // Allow only one replacement image.
//     });

//   // Form validation: require non-empty text fields.
//   const isFormValid =
//     formData.old_name.trim() &&
//     formData.new_name.trim() &&
//     formData.description.trim() &&
//     formData.theme.trim();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     const data = new FormData();
//     data.append("old_name", formData.old_name);
//     data.append("new_name", formData.new_name);
//     data.append("description", formData.description);
//     data.append("next_redirect_url", formData.next_redirect_url);
//     data.append("theme", formData.theme); // If a new file was chosen, use that; otherwise, send the existing URL.
//     if (oldImageFiles.length > 0) {
//       oldImageFiles.forEach((file) => data.append("old_images", file));
//     } else if (oldImageURLs.length > 0) {
//       // Send the existing URLs as a JSON string
//       data.append("old_images_existing", JSON.stringify(oldImageURLs));
//     }
//     if (newImageFiles.length > 0) {
//       newImageFiles.forEach((file) => data.append("new_images", file));
//     } else if (newImageURLs.length > 0) {
//       // Send the existing URLs as a JSON string
//       data.append("new_images_existing", JSON.stringify(newImageURLs));
//     }
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${params.id}`,
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       if (res.status === 200) {
//         router.push("/admin/dashboard");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       setError(
//         error instanceof Error ? error.message : "Failed to update product"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-lg">Loading product data...</p>
//           </div>
//         </div>
//       </>
//     );
//   }
//   if (!product) {
//     return (
//       <div className="container mx-auto p-8">
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-xl mx-auto">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-yellow-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-yellow-700">
//                 Product not found. The product may have been deleted or you may
//                 not have permission to view it.
//               </p>
//               <div className="mt-4">
//                 <Button
//                   onClick={() => router.push("/admin/dashboard")}
//                   variant="outline"
//                   size="sm"
//                 >
//                   Return to Dashboard
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-6 max-w-xl mx-auto bg-white shadow p-8 rounded-lg"
//       >
//         <div className="flex flex-col">
//           <label htmlFor="old_name" className="font-medium mb-1">
//             Old Name
//           </label>
//           <Input
//             id="old_name"
//             type="text"
//             name="old_name"
//             value={formData.old_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="new_name" className="font-medium mb-1">
//             New Name
//           </label>
//           <Input
//             id="new_name"
//             type="text"
//             name="new_name"
//             value={formData.new_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="description" className="font-medium mb-1">
//             Description
//           </label>
//           <Textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="next_redirect_url" className="font-medium mb-1">
//             Next Redirect URL
//           </label>
//           <Input
//             id="next_redirect_url"
//             type="url"
//             name="next_redirect_url"
//             value={formData.next_redirect_url}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-medium mb-1">Theme Color</span>
//           <div className="flex items-center gap-4">
//             <label className="flex items-center gap-1">
//               <input
//                 type="radio"
//                 name="theme"
//                 value="light"
//                 checked={formData.theme === "light"}
//                 onChange={handleThemeChange}
//               />
//               <span>Light</span>
//             </label>
//             <label className="flex items-center gap-1">
//               <input
//                 type="radio"
//                 name="theme"
//                 value="dark"
//                 checked={formData.theme === "dark"}
//                 onChange={handleThemeChange}
//               />
//               <span>Dark</span>
//             </label>
//           </div>
//         </div>
//         {/* Old Images Section */}
//         <div className="flex flex-col">
//           <label className="font-medium mb-1">Old Image</label>
//           {/* Display existing old image if available */}
//           {oldImageURLs.length > 0 && (
//             <div className="relative mb-2 inline-block">
//               <img
//                 src={oldImageURLs[0] || "/placeholder.svg"}
//                 alt="Existing Old"
//                 className="h-24 w-24 object-cover rounded border"
//               />
//               <button
//                 type="button"
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                 onClick={() => setOldImageURLs([])}
//                 aria-label="Remove image"
//               >
//                 ×
//               </button>
//             </div>
//           )}
//           {/* Dropzone for replacing old image */}
//           <div
//             {...getOldRootProps()}
//             className="border-dashed border-2 p-4 text-center cursor-pointer rounded hover:bg-gray-50 transition-colors"
//           >
//             <input {...getOldInputProps()} />
//             <p>
//               {oldImageFiles.length > 0
//                 ? "Replace image"
//                 : "Drag and drop or click to replace old image"}
//             </p>
//           </div>
//           {/* Preview new file if chosen */}
//           {oldImageFiles.length > 0 && (
//             <div className="relative mt-2 inline-block">
//               <img
//                 src={
//                   URL.createObjectURL(oldImageFiles[0]) || "/placeholder.svg"
//                 }
//                 alt="New Old"
//                 className="h-24 w-24 object-cover rounded border"
//               />
//               <button
//                 type="button"
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                 onClick={() => setOldImageFiles([])}
//                 aria-label="Remove image"
//               >
//                 ×
//               </button>
//             </div>
//           )}
//         </div>
//         {/* New Images Section */}
//         <div className="flex flex-col">
//           <label className="font-medium mb-1">New Image</label>
//           {newImageURLs.length > 0 && (
//             <div className="relative mb-2 inline-block">
//               <img
//                 src={newImageURLs[0] || "/placeholder.svg"}
//                 alt="Existing New"
//                 className="h-24 w-24 object-cover rounded border"
//               />
//               <button
//                 type="button"
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                 onClick={() => setNewImageURLs([])}
//                 aria-label="Remove image"
//               >
//                 ×
//               </button>
//             </div>
//           )}
//           <div
//             {...getNewRootProps()}
//             className="border-dashed border-2 p-4 text-center cursor-pointer rounded hover:bg-gray-50 transition-colors"
//           >
//             <input {...getNewInputProps()} />
//             <p>
//               {newImageFiles.length > 0
//                 ? "Replace image"
//                 : "Drag and drop or click to replace new image"}
//             </p>
//           </div>
//           {newImageFiles.length > 0 && (
//             <div className="relative mt-2 inline-block">
//               <img
//                 src={
//                   URL.createObjectURL(newImageFiles[0]) || "/placeholder.svg"
//                 }
//                 alt="New New"
//                 className="h-24 w-24 object-cover rounded border"
//               />
//               <button
//                 type="button"
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                 onClick={() => setNewImageFiles([])}
//                 aria-label="Remove image"
//               >
//                 ×
//               </button>
//             </div>
//           )}
//         </div>
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}
//         <Button
//           type="submit"
//           className="w-full"
//           disabled={!isFormValid || submitting}
//         >
//           {submitting ? "Updating..." : "Update Product"}
//         </Button>
//       </form>
//     </main>
//   );
// }

"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import Navbar from "@/components/navbar";

type Product = {
  id: string;
  old_name: string;
  new_name: string;
  category_id: string;
  category_name: string;
  description: string;
  description_points: string[];
  next_redirect_url: string;
  redirect_timer: number;
  theme: string;
  generated_link: string;
  old_images: string[];
  new_images: string[];
  badge_image_url?: string;
  extra_badge_1?: string;
  extra_badge_2?: string;
  meta_description?: string;
  seo_title?: string;
  rename_reason?: string;
  total_clicks?: number;
};

type Category = {
  id: string;
  name: string;
  description: string;
  description_points: string[];
  product_count: number;
  created_at: string;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    old_name: "",
    new_name: "",
    category_id: "",
    next_redirect_url: "",
    redirect_timer: 0,
    theme: "light",
    meta_description: "",
    seo_title: "",
  });

  // For images: existing image URLs and new file replacements.
  const [oldImageURLs, setOldImageURLs] = useState<string[]>([]);
  const [newImageURLs, setNewImageURLs] = useState<string[]>([]);
  const [oldImageFiles, setOldImageFiles] = useState<File[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product details and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${params.id}`
        );
        const productData = productRes.data;
        setProduct(productData);

        // Fetch categories
        const categoriesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`
        );
        setCategories(categoriesRes.data);

        // Set the form data from the fetched product
        setFormData({
          old_name: productData.old_name || "",
          new_name: productData.new_name || "",
          category_id: productData.category_id || "",
          next_redirect_url: productData.next_redirect_url || "",
          redirect_timer: productData.redirect_timer || 0,
          theme: productData.theme || "light",
          meta_description: productData.meta_description || "",
          seo_title: productData.seo_title || "",
        });

        // Handle the image URLs (API already parses the JSON)
        setOldImageURLs(
          Array.isArray(productData.old_images) ? productData.old_images : []
        );
        setNewImageURLs(
          Array.isArray(productData.new_images) ? productData.new_images : []
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, theme: e.target.value }));
  };



  // Dropzone for old images: if new file(s) are chosen, replace old images.
  const onDropOld = useCallback((acceptedFiles: File[]) => {
    setOldImageFiles(acceptedFiles); // Replace existing new file state.
    setOldImageURLs([]); // Clear preserved URL(s).
  }, []);
  const { getRootProps: getOldRootProps, getInputProps: getOldInputProps } =
    useDropzone({
      onDrop: onDropOld,
      accept: { "image/*": [] },
      multiple: false, // Allow only one replacement image.
    });

  // Dropzone for new images: if new file(s) are chosen, replace new images.
  const onDropNew = useCallback((acceptedFiles: File[]) => {
    setNewImageFiles(acceptedFiles);
    setNewImageURLs([]);
  }, []);
  const { getRootProps: getNewRootProps, getInputProps: getNewInputProps } =
    useDropzone({
      onDrop: onDropNew,
      accept: { "image/*": [] },
      multiple: false, // Allow only one replacement image.
    });

  // Form validation: require non-empty text fields.
  const isFormValid =
    formData.old_name.trim() &&
    formData.new_name.trim() &&
    formData.category_id.trim() &&
    formData.theme.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData();

    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });

    // Handle images
    if (oldImageFiles.length > 0) {
      oldImageFiles.forEach((file) => data.append("old_images", file));
    } else if (oldImageURLs.length > 0) {
      // Send the existing URLs as a JSON string
      data.append("old_images_existing", JSON.stringify(oldImageURLs));
    }

    if (newImageFiles.length > 0) {
      newImageFiles.forEach((file) => data.append("new_images", file));
    } else if (newImageURLs.length > 0) {
      // Send the existing URLs as a JSON string
      data.append("new_images_existing", JSON.stringify(newImageURLs));
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${params.id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status === 200) {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading product data...</p>
          </div>
        </div>
      </>
    );
  }
  if (!product) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Product not found. The product may have been deleted or you may
                not have permission to view it.
              </p>
              <div className="mt-4">
                <Button
                  onClick={() => router.push("/admin/dashboard")}
                  variant="outline"
                  size="sm"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl mx-auto bg-white shadow p-8 rounded-lg"
      >
        <div className="flex flex-col">
          <label htmlFor="old_name" className="font-medium mb-1">
            Old Name
          </label>
          <Input
            id="old_name"
            type="text"
            name="old_name"
            value={formData.old_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="new_name" className="font-medium mb-1">
            New Name
          </label>
          <Input
            id="new_name"
            type="text"
            name="new_name"
            value={formData.new_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="category_id" className="font-medium mb-1">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {product && product.category_name && (
            <p className="text-sm text-gray-600 mt-1">
              Current category: <span className="font-medium">{product.category_name}</span>
            </p>
          )}
        </div>

        {/* Display category description and points for reference */}
        {formData.category_id && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium mb-2">Category Details</h4>
            {(() => {
              const selectedCategory = categories.find(c => c.id === formData.category_id);
              if (!selectedCategory) return null;
              return (
                <div>
                  <p className="text-sm text-gray-700 mb-2">{selectedCategory.description}</p>
                  {selectedCategory.description_points && selectedCategory.description_points.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Key Points:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        {selectedCategory.description_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="next_redirect_url" className="font-medium mb-1">
            Next Redirect URL
          </label>
          <Input
            id="next_redirect_url"
            type="url"
            name="next_redirect_url"
            value={formData.next_redirect_url}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="redirect_timer" className="font-medium mb-1">
            Redirect Timer (seconds)
          </label>
          <Input
            id="redirect_timer"
            type="number"
            name="redirect_timer"
            value={formData.redirect_timer}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="font-medium mb-1">Theme Color</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={formData.theme === "light"}
                onChange={handleThemeChange}
              />
              <span>Light</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={formData.theme === "dark"}
                onChange={handleThemeChange}
              />
              <span>Dark</span>
            </label>
          </div>
        </div>

        {/* SEO Fields */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">SEO Settings</h3>

          <div className="flex flex-col mb-4">
            <label htmlFor="meta_description" className="font-medium mb-1">
              Meta Description
            </label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="seo_title" className="font-medium mb-1">
              SEO Title
            </label>
            <Input
              id="seo_title"
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
            />
          </div>

          {/* <div className="flex flex-col">
            <label htmlFor="page_title" className="font-medium mb-1">
              Page Title
            </label>
            <Input id="page_title" name="page_title" value={formData.page_title} onChange={handleChange} />
          </div>
        </div> */}
        </div>

        {/* Popup Settings */}
        {/* <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Popup Settings</h3>

          <div className="flex flex-col mb-4">
            <label htmlFor="popup_title" className="font-medium mb-1">
              Popup Title
            </label>
            <Input id="popup_title" name="popup_title" value={formData.popup_title} onChange={handleChange} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="popup_content" className="font-medium mb-1">
              Popup Content
            </label>
            <Textarea id="popup_content" name="popup_content" value={formData.popup_content} onChange={handleChange} />
          </div>
        </div> */}

        {/* Badge Settings */}
        {/* <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Badge Settings</h3>

          <div className="flex flex-col mb-4">
            <label htmlFor="badge_image_url" className="font-medium mb-1">
              Badge Image URL
            </label>
            <Input
              id="badge_image_url"
              name="badge_image_url"
              value={formData.badge_image_url}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="extra_badge_1" className="font-medium mb-1">
              Extra Badge 1
            </label>
            <Input id="extra_badge_1" name="extra_badge_1" value={formData.extra_badge_1} onChange={handleChange} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="extra_badge_2" className="font-medium mb-1">
              Extra Badge 2
            </label>
            <Input id="extra_badge_2" name="extra_badge_2" value={formData.extra_badge_2} onChange={handleChange} />
          </div>
        </div> */}

        {/* Rename Reason */}
        {/* <div className="flex flex-col">
          <label htmlFor="rename_reason" className="font-medium mb-1">
            Rename Reason
          </label>
          <Textarea id="rename_reason" name="rename_reason" value={formData.rename_reason} onChange={handleChange} />
        </div> */}

        {/* Old Images Section */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Old Image</label>
          {/* Display existing old image if available */}
          {oldImageURLs.length > 0 && (
            <div className="relative mb-2 inline-block">
              <img
                src={oldImageURLs[0] || "/placeholder.svg"}
                alt="Existing Old"
                className="h-24 w-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => setOldImageURLs([])}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
          {/* Dropzone for replacing old image */}
          <div
            {...getOldRootProps()}
            className="border-dashed border-2 p-4 text-center cursor-pointer rounded hover:bg-gray-50 transition-colors"
          >
            <input {...getOldInputProps()} />
            <p>
              {oldImageFiles.length > 0
                ? "Replace image"
                : "Drag and drop or click to replace old image"}
            </p>
          </div>
          {/* Preview new file if chosen */}
          {oldImageFiles.length > 0 && (
            <div className="relative mt-2 inline-block">
              <img
                src={
                  URL.createObjectURL(oldImageFiles[0]) || "/placeholder.svg"
                }
                alt="New Old"
                className="h-24 w-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => setOldImageFiles([])}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {/* New Images Section */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">New Image</label>
          {newImageURLs.length > 0 && (
            <div className="relative mb-2 inline-block">
              <img
                src={newImageURLs[0] || "/placeholder.svg"}
                alt="Existing New"
                className="h-24 w-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => setNewImageURLs([])}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
          <div
            {...getNewRootProps()}
            className="border-dashed border-2 p-4 text-center cursor-pointer rounded hover:bg-gray-50 transition-colors"
          >
            <input {...getNewInputProps()} />
            <p>
              {newImageFiles.length > 0
                ? "Replace image"
                : "Drag and drop or click to replace new image"}
            </p>
          </div>
          {newImageFiles.length > 0 && (
            <div className="relative mt-2 inline-block">
              <img
                src={
                  URL.createObjectURL(newImageFiles[0]) || "/placeholder.svg"
                }
                alt="New New"
                className="h-24 w-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => setNewImageFiles([])}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </main>
  );
}
