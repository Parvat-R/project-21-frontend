
import { WalletBalance, AddWalletAmount } from "@/components/wallet/user-wallet"
import { WalletHistory } from "@/components/wallet/wallet-history"

export default function WalletPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
                </div>

             
                <WalletBalance />

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <AddWalletAmount />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900">₹4,250</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">4</p>
                        </div>
                    </div>
                </div>

                
                <WalletHistory />
            </div>
        </div>
    )
}