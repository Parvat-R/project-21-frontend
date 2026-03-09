"use client"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Wallet } from "lucide-react"

export function WalletBalance() {
    const [balance] = useState(5000)

    return (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardDescription className="text-blue-100">Current Balance</CardDescription>
                        <CardTitle className="text-4xl font-bold mt-2">₹{balance.toLocaleString()}</CardTitle>
                    </div>
                    <Wallet className="w-12 h-12 opacity-20" />
                </div>
            </CardHeader>
        </Card>
    )
}

export function AddWalletAmount() {
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleAdd() {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount")
            return
        }

        setIsLoading(true)
        try {
            
            await new Promise(resolve => setTimeout(resolve, 800))
            console.log(`Adding ₹${amount} to wallet`)
            setSuccess(true)
            setAmount("")
   
            setTimeout(() => setSuccess(false), 3000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Wallet Amount</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount to add"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isLoading}
                            min="1"
                            step="100"
                            className="text-lg"
                        />
                    </div>
                    
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                            ✓ Amount added successfully!
                        </div>
                    )}
                    
                    <Button
                        onClick={handleAdd}
                        disabled={isLoading || !amount}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? "Processing..." : "Add Amount"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
