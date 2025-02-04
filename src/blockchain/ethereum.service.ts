import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contractAddress = process.env.CONTRACT_ADDRESS!;
const contractAbi = [
  "function createMatch(string title, uint256 startTime, uint256 totalSeats, string[] tags) external",
  "function buyTicket(uint256 matchId, uint256 price) external",
  "function getRemainingSeats(uint256 matchId) public view returns (uint256)",
  "function getAllMatches() public view returns (tuple(uint256 matchId, string title, uint256 startTime, uint256 totalSeats, uint256 soldSeats, string[] tags)[])"
];

export const ticketingContract = new ethers.Contract(contractAddress, contractAbi, wallet);

export async function createMatch(title: string, startTime: number, totalSeats: number, tags: string[]) {
    const tx = await ticketingContract.createMatch(title, startTime, totalSeats, tags);
    await tx.wait();
    return tx.hash;
}

export async function buyTicket(matchId: number, price: number, buyer: string) {
    const tx = await ticketingContract.connect(wallet).buyTicket(matchId, price, { from: buyer });
    await tx.wait();
    return tx.hash;
}

export async function getRemainingSeats(matchId: number) {
    return await ticketingContract.getRemainingSeats(matchId);
}

export async function getAllMatches() {
    return await ticketingContract.getAllMatches();
}