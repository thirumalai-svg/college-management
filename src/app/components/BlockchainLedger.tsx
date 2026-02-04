import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  FileText,
  Calendar,
  BookOpen,
  Shield,
  CheckCircle,
  Link as LinkIcon,
  Hash,
} from 'lucide-react';
import { BlockchainRecord } from '../utils/blockchain';

interface BlockchainLedgerProps {
  userFilter?: string;
}

export function BlockchainLedger({ userFilter }: BlockchainLedgerProps) {
  const { blockchain } = useData();
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);

  const chain = userFilter
    ? blockchain.getRecordsByUser(userFilter)
    : blockchain.getChain();

  const isChainValid = blockchain.verifyChain();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <FileText className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'resource':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'leave':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'resource':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Blockchain Ledger</h2>
        <p className="text-gray-600">
          Immutable record of all activities with SHA-256 cryptographic hashing
        </p>
      </div>

      {/* Chain Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                isChainValid ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isChainValid ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Shield className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div>
                <div className="font-semibold">
                  {isChainValid ? 'Blockchain Verified' : 'Blockchain Compromised'}
                </div>
                <div className="text-sm text-gray-600">
                  {chain.length} blocks • All records are immutable and tamper-proof
                </div>
              </div>
            </div>
            <Badge variant={isChainValid ? 'default' : 'destructive'} className="h-fit">
              {isChainValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Record List */}
        <div className="space-y-3">
          <h3 className="font-semibold">Transaction History</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {chain.slice().reverse().map((record, index) => (
              <Card
                key={record.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedRecord?.id === record.id ? 'ring-2 ring-indigo-600' : ''
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(record.type)}`}>
                      {getTypeIcon(record.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{record.action}</span>
                        <Badge variant="outline" className="capitalize">
                          {record.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {record.userName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(record.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Block #{record.id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Block Details */}
        <div className="sticky top-6">
          {selectedRecord ? (
            <Card>
              <CardHeader>
                <CardTitle>Block Details</CardTitle>
                <CardDescription>Block #{selectedRecord.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Timestamp</div>
                  <div className="font-mono text-sm">
                    {new Date(selectedRecord.timestamp).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Action</div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(selectedRecord.type)}>
                      {getTypeIcon(selectedRecord.type)}
                      <span className="ml-2 capitalize">{selectedRecord.type}</span>
                    </Badge>
                    <span>{selectedRecord.action}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">User</div>
                  <div>
                    {selectedRecord.userName} ({selectedRecord.userId})
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Data</div>
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs break-all">
                    {JSON.stringify(selectedRecord.data, null, 2)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Block Hash (SHA-256)
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg font-mono text-xs break-all text-indigo-700">
                    {selectedRecord.hash}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Previous Block Hash
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs break-all text-gray-600">
                    {selectedRecord.previousHash}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Immutable Record</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    This block is cryptographically linked to the previous block. Any
                    tampering will break the chain and be immediately detected.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Select a block to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Blockchain Works in This Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Leave Applications</h4>
              <p className="text-sm text-gray-600">
                Every leave application and approval/rejection is recorded in the
                blockchain with timestamps and faculty signatures.
              </p>
            </div>
            <div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Event Participation</h4>
              <p className="text-sm text-gray-600">
                Event registrations and attendance are permanently recorded, useful for
                certificates and placement records.
              </p>
            </div>
            <div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Resource Contributions</h4>
              <p className="text-sm text-gray-600">
                Student contributions (uploads, notes) are recorded with credit history
                for academic recognition.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
