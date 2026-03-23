import Link from 'next/link';
import { Card } from '../ui/Card';

export interface Item {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string;
  warrantyDurationMonths: number;
}

export function ItemCard({ item }: { item: Item }) {
  const purchaseDate = new Date(item.purchaseDate);
  const expirationDate = new Date(purchaseDate);
  expirationDate.setMonth(expirationDate.getMonth() + item.warrantyDurationMonths);
  
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let statusColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
  let statusText = 'Expired';
  
  if (diffDays > 30) {
    statusColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    statusText = `${diffDays} Days Left`;
  } else if (diffDays > 0) {
    statusColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    statusText = `Exp in ${diffDays}d`;
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(purchaseDate);

  return (
    <Card className="hover-lift cursor-pointer flex flex-col h-full group transition-all duration-300">
      <Link href={`/items/${item.id}`} className="flex flex-col h-full p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-2">
            <span className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{item.brand}</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {item.name}
            </h3>
          </div>
          <div className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor} whitespace-nowrap`}>
            {statusText}
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">Category</p>
            <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.category}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">Purchased</p>
            <p className="font-medium text-slate-700 dark:text-slate-300">{formattedDate}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
}
