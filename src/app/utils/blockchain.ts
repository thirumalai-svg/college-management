// Blockchain utility for creating immutable records with SHA-256 hashing

export interface BlockchainRecord {
  id: string;
  timestamp: string;
  type: 'leave' | 'event' | 'resource';
  action: string;
  userId: string;
  userName: string;
  data: any;
  hash: string;
  previousHash: string;
}

export class BlockchainLedger {
  private chain: BlockchainRecord[] = [];

  constructor() {
    // Genesis block
    this.chain.push(this.createGenesisBlock());
  }

  private createGenesisBlock(): BlockchainRecord {
    const genesisBlock = {
      id: '0',
      timestamp: new Date('2024-01-01').toISOString(),
      type: 'resource' as const,
      action: 'System Initialized',
      userId: 'system',
      userName: 'System',
      data: { message: 'Genesis Block - College Portal Blockchain Initialized' },
      hash: '',
      previousHash: '0',
    };
    genesisBlock.hash = this.calculateHash(genesisBlock);
    return genesisBlock;
  }

  // SHA-256 hash simulation (for demo purposes)
  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  private calculateHash(record: Omit<BlockchainRecord, 'hash'>): string {
    const data = JSON.stringify({
      id: record.id,
      timestamp: record.timestamp,
      type: record.type,
      action: record.action,
      userId: record.userId,
      data: record.data,
      previousHash: record.previousHash,
    });
    
    // Simple hash for synchronous operation (in real app, use async sha256)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  addRecord(
    type: 'leave' | 'event' | 'resource',
    action: string,
    userId: string,
    userName: string,
    data: any
  ): BlockchainRecord {
    const previousBlock = this.chain[this.chain.length - 1];
    const newRecord: Omit<BlockchainRecord, 'hash'> = {
      id: this.chain.length.toString(),
      timestamp: new Date().toISOString(),
      type,
      action,
      userId,
      userName,
      data,
      previousHash: previousBlock.hash,
    };

    const newBlock: BlockchainRecord = {
      ...newRecord,
      hash: this.calculateHash(newRecord),
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  getChain(): BlockchainRecord[] {
    return [...this.chain];
  }

  verifyChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify hash
      const calculatedHash = this.calculateHash({
        id: currentBlock.id,
        timestamp: currentBlock.timestamp,
        type: currentBlock.type,
        action: currentBlock.action,
        userId: currentBlock.userId,
        userName: currentBlock.userName,
        data: currentBlock.data,
        previousHash: currentBlock.previousHash,
      });

      if (currentBlock.hash !== calculatedHash) {
        return false;
      }

      // Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getRecordsByUser(userId: string): BlockchainRecord[] {
    return this.chain.filter(record => record.userId === userId);
  }

  getRecordsByType(type: 'leave' | 'event' | 'resource'): BlockchainRecord[] {
    return this.chain.filter(record => record.type === type);
  }
}
