import React from 'react';
import { Clock, Download, Trash2, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HistoryItem {
  id: string;
  images: string[];
  createdAt: Date;
  prompt?: string;
  creditsUsed: number;
}

interface HistoryPanelProps {
  historyItems: HistoryItem[];
  onViewItem: (item: HistoryItem) => void;
  onDownloadItem: (item: HistoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  historyItems,
  onViewItem,
  onDownloadItem,
  onDeleteItem,
  searchQuery,
  onSearchChange,
}) => {
  const filteredItems = historyItems.filter(item =>
    item.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === ''
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (historyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="p-4 rounded-xl bg-secondary/50 mb-4">
          <Clock className="h-12 w-12 text-foreground-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No generation history yet
        </h3>
        <p className="text-sm text-foreground-muted max-w-sm">
          Your generated images will appear here. Start creating to build your history!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary/50 border-border"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-card rounded-xl border border-border hover:border-border-hover transition-all duration-200 overflow-hidden"
          >
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-0.5 aspect-[4/1]">
              {item.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative overflow-hidden bg-secondary">
                  <img
                    src={img}
                    alt={`History item ${item.id} - ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Info & Actions */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground-muted">
                  {formatDate(item.createdAt)}
                </p>
                {item.prompt && (
                  <p className="text-sm text-foreground truncate mt-0.5">
                    {item.prompt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onViewItem(item)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDownloadItem(item)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDeleteItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-sm text-foreground-muted">
              No results found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};