"use client";

import { useEffect, useState } from "react";
import { ItemCard, Item } from "@/components/items/ItemCard";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const loadItems = async () => {
        try {
          const res = await fetchApi("/items");
          if (res.success) {
            // map MongoDB _id to id
            const mappedItems = res.data.map((item: any) => ({
              ...item,
              id: item._id
            }));
            setItems(mappedItems);
          }
        } catch (error) {
          console.error("Failed to fetch items", error);
        } finally {
          setLoading(false);
        }
      };

      loadItems();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            My Assets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your devices and warranty status</p>
        </div>
        <Link href="/items/new">
          <Button variant="primary" className="w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Asset
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
        
        {/* Empty state card for adding new item */}
        <Link href="/items/new" className="group">
          <div className="h-full min-h-[160px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-sm">Add New Asset</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
