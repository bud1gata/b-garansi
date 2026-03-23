"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EditItemPage() {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const itemId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && itemId) {
      loadItemData();
    }
  }, [user, authLoading, router, itemId]);

  const loadItemData = async () => {
    try {
      const res = await fetchApi(`/items/${itemId}`);
      if (res.success) {
        setItem(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load item specifics");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    
    // Remove empty file upload so it doesn't overwrite
    const file = fd.get('receiptImage') as File;
    if (file && file.size === 0) {
      fd.delete('receiptImage');
    }

    try {
      const res = await fetchApi(`/items/${itemId}`, {
        method: "PUT",
        body: fd
      });

      if (res.success) {
        router.push(`/items/${itemId}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update asset.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-12 text-red-500">
        <Card className="p-8 inline-block bg-red-50 border-red-200">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || "Item not found"}</p>
          <Button className="mt-4" onClick={() => router.push("/")}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/items/${item._id}`} className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Asset</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Update information for {item.name}</p>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <form className="flex flex-col gap-6" onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="name" label="Item Name" defaultValue={item.name} required />
            <Input name="brand" label="Brand / Merk" defaultValue={item.brand} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select name="category" defaultValue={item.category} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Laptop">Laptop / PC</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Camera">Camera & Lens</option>
                <option value="Audio">Audio Equipment</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Other">Other Electronics</option>
              </select>
            </div>
            
            <Input name="purchaseDate" label="Purchase Date" type="date" defaultValue={new Date(item.purchaseDate).toISOString().split('T')[0]} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="warrantyDurationMonths" label="Warranty Duration (Months)" type="number" min="1" defaultValue={item.warrantyDurationMonths} required />
          </div>

          <div className="flex flex-col gap-1.5 w-full mt-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Update Digital Receipt</label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                {item.receiptImage && item.receiptImage !== 'no-photo.jpg' ? (
                  <img src={`http://localhost:5000${item.receiptImage}`} alt="Current Ticket" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <label className="flex flex-col items-center justify-center h-16 px-4 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-1">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Click to upload new receipt (optional)</span>
                <input name="receiptImage" type="file" className="hidden" accept="image/*, application/pdf" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link href={`/items/${item._id}`}>
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>{saving ? "Updating..." : "Update Asset"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
