import { AddWalletAmount, WalletBalance } from "@/components/wallet/user-wallet";
import { WalletHistory } from "@/components/wallet/wallet-history";

export default function OrganiserWalletPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-sm text-muted-foreground">Common wallet view for organiser and user.</p>
      </div>

      <WalletBalance />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AddWalletAmount />
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div className="rounded-lg border bg-card p-4">
            <p className="mb-1 text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">₹4,250</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="mb-1 text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">4</p>
          </div>
        </div>
      </div>

      <WalletHistory />
    </div>
  );
}
