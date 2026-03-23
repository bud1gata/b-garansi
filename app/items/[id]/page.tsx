"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ItemDetailPage() {
  const [showLightbox, setShowLightbox] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      setError(err.message || "Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = fd.get('date') as string;
    const desc = fd.get('description') as string;
    const cost = Number(fd.get('cost'));

    try {
      // POST to services router
      const res = await fetchApi(`/items/${itemId}/services`, {
        method: "POST",
        body: JSON.stringify({ date, description: desc, cost }),
      });

      if (res.success) {
        setShowServiceForm(false);
        loadItemData(); // Reload to get updated services
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await fetchApi(`/items/${itemId}`, { method: "DELETE" });
        router.push("/");
      } catch (err) {
        console.error(err);
      }
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
        <Card className="p-8 inline-block bg-red-50 dark:bg-red-900/10 border-red-200">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || "Item not found"}</p>
          <Button className="mt-4" onClick={() => router.push("/")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  // Calculations
  const purchaseDate = new Date(item.purchaseDate);
  const expirationDate = new Date(purchaseDate);
  expirationDate.setMonth(expirationDate.getMonth() + item.warrantyDurationMonths);
  
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let statusColor = 'bg-red-500 shadow-red-500/30';
  let bannerClass = 'from-red-600 to-red-800';
  let statusText = 'Warranty Expired';
  
  if (diffDays > 30) {
    statusColor = 'bg-green-500 shadow-green-500/30';
    bannerClass = 'from-emerald-500 to-green-700';
    statusText = `Active warranty (${diffDays} Days Left)`;
  } else if (diffDays > 0) {
    statusColor = 'bg-yellow-500 shadow-yellow-500/30';
    bannerClass = 'from-yellow-500 to-amber-700';
    statusText = `Expiring soon (${diffDays} Days Left)`;
  }

  const logs = item.services || [];
  const totalCost = logs.reduce((acc: number, log: any) => acc + log.cost, 0);
  const receiptUrl = item.receiptImage && item.receiptImage !== 'no-photo.jpg' 
    ? `http://localhost:5000${item.receiptImage}` 
    : null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-sm font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {item.category}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={`/items/${item._id}/edit`}>
            <Button variant="ghost" size="sm">Edit</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className={`h-2 w-full bg-gradient-to-r ${bannerClass}`}></div>
            <div className="p-6 md:p-8">
              <span className="text-sm font-bold tracking-wider text-slate-500 uppercase">{item.brand}</span>
              <h1 className="text-3xl font-bold mt-1 mb-6 text-slate-900 dark:text-white">{item.name}</h1>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Purchase Date</p>
                  <p className="font-semibold">{new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(purchaseDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Warranty Length</p>
                  <p className="font-semibold">{item.warrantyDurationMonths} Months</p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${statusColor} shadow-lg ring-4 ring-slate-100 dark:ring-slate-800`}></div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5">Current Status</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{statusText}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Service History</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total spent: ${totalCost.toLocaleString()}</p>
              </div>
              <Button size="sm" onClick={() => setShowServiceForm(!showServiceForm)}>
                {showServiceForm ? 'Cancel' : '+ Add Record'}
              </Button>
            </div>
            
            {showServiceForm && (
              <form onSubmit={handleAddService} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <Input label="Date of Service" name="date" type="date" required />
                  <Input label="Cost ($)" name="cost" type="number" min="0" placeholder="0 if covered by warranty" required />
                </div>
                <Input label="Description of Issue / Fix" name="description" placeholder="e.g. Broken screen replaced" className="mb-4" required />
                <Button type="submit" size="sm" className="w-full">Save Service Record</Button>
              </form>
            )}

            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <p>No service records found.</p>
                <p className="text-sm mt-1">Keep track of your device repairs and maintenance costs here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log: any) => (
                  <div key={log._id} className="flex flex-col sm:flex-row justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-2">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{log.description}</h4>
                      <p className="text-sm text-slate-500">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(log.date))}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className={`font-bold ${log.cost === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {log.cost === 0 ? 'Covered' : `$${log.cost}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card className="p-5">
            <h2 className="font-bold mb-4">Digital Receipt</h2>
            <div 
              onClick={() => receiptUrl && setShowLightbox(true)}
              className={`aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden relative group ${receiptUrl ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}`}
              style={receiptUrl ? { backgroundImage: `url(${receiptUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {receiptUrl ? (
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <span className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">View Full Screen</span>
                </div>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">No Receipt Uploaded</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {showLightbox && receiptUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4" onClick={() => setShowLightbox(false)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Receipt - {item.name}</h3>
              <button onClick={() => setShowLightbox(false)} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-black rounded-lg overflow-auto flex items-center justify-center min-h-[50vh]">
              <img src={receiptUrl} alt="Receipt" className="max-w-full max-h-[75vh] object-contain" />
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  Open Original
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
