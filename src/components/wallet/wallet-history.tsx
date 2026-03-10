"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Payment {
  paymentId: string
  eventId: string
  amount: number
  date?: string
  status?: 'completed' | 'pending' | 'failed'
}

export function WalletHistory() {
    const payments: Payment[] = [
        {
            paymentId: 'PAY-001',
            eventId: 'EVT-E1',
            amount: 1000,
            date: '2026-03-08',
            status: 'completed'
        },
        {
            paymentId: 'PAY-002',
            eventId: 'EVT-E2',
            amount: 500,
            date: '2026-03-07',
            status: 'completed'
        },
        {
            paymentId: 'PAY-003',
            eventId: 'EVT-E3',
            amount: 2000,
            date: '2026-03-06',
            status: 'completed'
        },
        {
            paymentId: 'PAY-004',
            eventId: 'EVT-E4',
            amount: 750,
            date: '2026-03-05',
            status: 'pending'
        },
    ]

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'failed':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Wallet History</CardTitle>
                <CardDescription>View your recent transactions and payments</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>Your payment transactions</TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Payment ID</TableHead>
                            <TableHead className="font-semibold">Event ID</TableHead>
                            <TableHead className="font-semibold">Amount</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <TableRow key={payment.paymentId} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-blue-600">{payment.paymentId}</TableCell>
                                    <TableCell>{payment.eventId}</TableCell>
                                    <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-sm text-gray-500">{payment.date}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(payment.status)} border-0`}>
                                            {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No transactions yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
