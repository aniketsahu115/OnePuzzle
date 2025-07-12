import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function ProfileModal({ open, onClose, walletAddress }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    await apiRequest("POST", "/api/profile/update", { walletAddress, username });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Profile</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <Button onClick={handleCreate} disabled={loading || !username}>
          {loading ? "Saving..." : "Create Profile"}
        </Button>
      </DialogContent>
    </Dialog>
  );
} 