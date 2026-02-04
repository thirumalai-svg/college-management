import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { DollarSign, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { FeeRecord } from '../contexts/DataContext';

interface FeesViewProps {
  fees: FeeRecord[];
}

export function FeesView({ fees }: FeesViewProps) {
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = totalFees - totalPaid;
  
  const paidCount = fees.filter(f => f.status === 'paid').length;
  const pendingCount = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Fee Payment Tracking</h2>
        <p className="text-gray-600">Manage your fee payments and history</p>
      </div>

      {/* Fee Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{formatCurrency(totalFees)}</div>
                <div className="text-sm text-gray-600">All semesters</div>
              </div>
              <DollarSign className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1 text-green-600">{formatCurrency(totalPaid)}</div>
                <div className="text-sm text-gray-600">{paidCount} semesters</div>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1 text-red-600">{formatCurrency(totalPending)}</div>
                <div className="text-sm text-gray-600">{pendingCount} semesters</div>
              </div>
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="text-2xl mb-1">
                {((totalPaid / totalFees) * 100).toFixed(0)}%
              </div>
              <Progress value={(totalPaid / totalFees) * 100} className="h-2" />
            </div>
            <div className="text-sm text-gray-600">Overall completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records */}
      <div className="space-y-4">
        {fees.map(fee => (
          <Card key={fee.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{fee.semester}</CardTitle>
                  <CardDescription>
                    Due Date: {new Date(fee.dueDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(fee.status)}>
                  {getStatusIcon(fee.status)}
                  <span className="ml-1 capitalize">{fee.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                    <div className="text-xl">{formatCurrency(fee.amount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Paid Amount</div>
                    <div className="text-xl text-green-600">{formatCurrency(fee.paidAmount)}</div>
                  </div>
                </div>

                {fee.paidAmount < fee.amount && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      Pending: {formatCurrency(fee.amount - fee.paidAmount)}
                    </div>
                    <Progress 
                      value={(fee.paidAmount / fee.amount) * 100} 
                      className="h-2 mb-3"
                    />
                  </div>
                )}

                {fee.status === 'paid' && fee.paymentDate && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="text-sm text-gray-600">Payment Date</div>
                      <div className="font-medium">{new Date(fee.paymentDate).toLocaleDateString()}</div>
                    </div>
                    {fee.transactionId && (
                      <div>
                        <div className="text-sm text-gray-600">Transaction ID</div>
                        <div className="font-mono text-sm">{fee.transactionId}</div>
                      </div>
                    )}
                  </div>
                )}

                {fee.status === 'pending' && (
                  <Button className="w-full md:w-auto">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}

                {fee.status === 'partial' && (
                  <Button className="w-full md:w-auto">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Remaining {formatCurrency(fee.amount - fee.paidAmount)}
                  </Button>
                )}

                {fee.status === 'overdue' && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Payment Overdue</span>
                    </div>
                    <p className="text-sm text-red-600 mb-3">
                      This payment is overdue. Please pay as soon as possible to avoid late fees.
                    </p>
                    <Button variant="destructive" className="w-full md:w-auto">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now with Late Fee
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Available payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-indigo-600 mb-2" />
              <div className="font-medium mb-1">Online Payment</div>
              <div className="text-sm text-gray-600">
                Credit/Debit Card, UPI, Net Banking
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
              <div className="font-medium mb-1">Bank Transfer</div>
              <div className="text-sm text-gray-600">
                Direct bank transfer or NEFT/RTGS
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
              <div className="font-medium mb-1">Cash/Cheque</div>
              <div className="text-sm text-gray-600">
                Visit accounts office during working hours
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
