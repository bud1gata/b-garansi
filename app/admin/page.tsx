"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      } else {
        fetchUsers();
      }
    }
  }, [user, authLoading, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/admin/users");
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: string, username: string) => {
    if (confirm(`Are you sure you want to approve ${username} for platform access?`)) {
      try {
        const res = await fetchApi(`/admin/users/${id}/approve`, { method: "PUT" });
        if (res.success) {
          // Update local state without fetching all users again
          setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
        }
      } catch (err: any) {
        alert(err.message || "Failed to approve user.");
      }
    }
  };

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
            Admin Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage user access and platform approvals.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {error && (
          <div className="m-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th scope="col" className="px-6 py-4">Username</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Registered On</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No standard users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {u.username}
                    </td>
                    <td className="px-6 py-4">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(u.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      {u.isApproved ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!u.isApproved && (
                        <Button 
                          size="sm" 
                          variant="primary" 
                          onClick={() => approveUser(u._id, u.username)}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
