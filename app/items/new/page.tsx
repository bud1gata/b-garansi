"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";

export default function AddItemPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    
    // Because the file input is handled nicely by FormData natively, we don't need manual parsing 
    // Just make sure the file name is 'receiptImage' matching multer config
    try {
      const res = await fetchApi("/items", {
        method: "POST",
        body: fd
      });

      if (res.success) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Asset</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Register a new device to track its warranty</p>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="name" label="Item Name" placeholder="e.g. MacBook Pro M3" required />
            <Input name="brand" label="Brand / Merk" placeholder="e.g. Apple" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select name="category" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Laptop">Laptop / PC</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Camera">Camera & Lens</option>
                <option value="Audio">Audio Equipment</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Other">Other Electronics</option>
              </select>
            </div>
            
            <Input name="purchaseDate" label="Purchase Date" type="date" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="warrantyDurationMonths" label="Warranty Duration (Months)" type="number" min="1" defaultValue="12" required />
          </div>

          <div className="flex flex-col gap-1.5 w-full mt-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Digital Receipt (Nota)</label>
            <label className="flex flex-col items-center justify-center w-full h-40 mt-1 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or PDF (MAX. 5MB)</p>
              </div>
              <input name="receiptImage" id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, application/pdf" />
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link href="/">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Asset"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
