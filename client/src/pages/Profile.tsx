import { useEffect, useState } from "react";
import { useWallet } from "@/lib/useWallet";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { walletAddress, connected } = useWallet();
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && walletAddress) {
      setLoading(true);
      apiRequest("POST", "/api/auth/wallet", { walletAddress })
        .then(res => res.json())
        .then(data => {
          setProfile(data.user);
          setUsername(data.user?.username || "");
        })
        .finally(() => setLoading(false));
    }
  }, [connected, walletAddress]);

  const handleSave = async () => {
    setLoading(true);
    await apiRequest("POST", "/api/profile/update", { walletAddress, username });
    setProfile((p: any) => ({ ...p, username }));
    setLoading(false);
  };

  if (!connected) return <div className="p-8 text-center">Connect your wallet to view your profile.</div>;

  return (
    <div className="max-w-xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Wallet Address</label>
            <Input value={walletAddress} readOnly />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 