import {
    JsonRpcProvider,
    Wallet,
    Contract,
    TransactionResponse,
    TransactionReceipt
  } from "ethers";
  import dotenv from "dotenv";
  
  dotenv.config();
  
  const provider: JsonRpcProvider = new JsonRpcProvider(process.env.ETH_RPC_URL);
  const wallet: Wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
  
  const contractAddress: string = process.env.CONTRACT_ADDRESS!;
  const contractAbi: string[] = [
    "function mintTicket(address to, uint256 ticketId, uint256 price) external",
    "function resellTicket(uint256 ticketId, address newOwner, uint256 newPrice) external",
    "function validateTicket(uint256 ticketId) external"
  ];
  
  const contract: Contract = new Contract(contractAddress, contractAbi, wallet);
  
  export async function mintTicket(to: string, ticketId: number, price: number): Promise<string> {
    console.log(`🎟️ Minting ticketId=${ticketId} -> ${to} price=${price}`);
    const tx: TransactionResponse = await contract.mintTicket(to, ticketId, price);
    // v6: tx.wait() peut renvoyer un TransactionReceipt | null
  const receipt: TransactionReceipt | null = await tx.wait();
  if (!receipt) {
    throw new Error("Transaction abandonnée ou remplacée (receipt=null).");
  }

  
    console.log(`✅ Mint OK, TX Hash: ${receipt.hash}`);
    return receipt.hash;
  }
  
  export async function resellTicket(ticketId: number, newOwner: string, newPrice: number): Promise<string> {
    console.log(`🔄 Revente ticketId=${ticketId} -> ${newOwner} price=${newPrice}`);
    const tx: TransactionResponse = await contract.resellTicket(ticketId, newOwner, newPrice);
    const receipt: TransactionReceipt | null = await tx.wait();
  
    if (!receipt) {
      throw new Error("Transaction abandonnée ou remplacée (receipt=null).");
    }
  
    console.log(`✅ Revente OK, TX Hash: ${receipt.hash}`);
    return receipt.hash;
  }
  
  export async function validateTicket(ticketId: number): Promise<string> {
    console.log(`✅ Validation ticketId=${ticketId}`);
    const tx: TransactionResponse = await contract.validateTicket(ticketId);
    const receipt: TransactionReceipt | null = await tx.wait();
  
    if (!receipt) {
      throw new Error("Transaction abandonnée ou remplacée (receipt=null).");
    }
  
    console.log(`✅ Validation OK, TX Hash: ${receipt.hash}`);
    return receipt.hash;
  }  