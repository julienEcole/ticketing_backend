// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Ticketing is ERC721Enumerable, Ownable {
    struct Ticket {
        uint256 price;
        uint256 resaleCount;
        bool isUsed; // 🔥 Indique si le ticket a été validé (utilisé)
        address[] previousOwners; // 🔥 Historique des propriétaires
    }

    mapping(uint256 => Ticket) public tickets;
    uint256 public maxResale = 2;
    uint256 public maxPriceIncrease = 120;

    constructor() ERC721("EventTicket", "TICKET") Ownable(msg.sender) {}

    /// 🔹 Fonction pour créer un ticket (Minting)
    function mintTicket(address to, uint256 ticketId, uint256 price) external onlyOwner {
        require(!_exists(ticketId), "Ticket already exists");
        tickets);
        _safeMint(to, ticketId);
    }

    /// 🔹 Fonction pour revendre un ticket
    function resellTicket(uint256 ticketId, address newOwner, uint256 newPrice) external {
        require(ownerOf(ticketId) == msg.sender, "Not the ticket owner");
        require(!tickets[ticketId].isUsed, "Used tickets cannot be resold"); // 🔥 Empêcher la revente si utilisé
        require(tickets[ticketId].resaleCount < maxResale, "Max resale reached");
        require(newPrice <= (tickets[ticketId].price * maxPriceIncrease) / 100, "Price too high");

        // 🔥 Ajouter l'ancien propriétaire à la liste
        tickets[ticketId].previousOwners.push(msg.sender);

        // 🔥 Transférer le ticket au nouveau propriétaire
        _transfer(msg.sender, newOwner, ticketId);

        // 🔥 Mettre à jour le prix et le compteur de revente
        tickets[ticketId].price = newPrice;
        tickets[ticketId].resaleCount += 1;
    }

    /// 🔹 Fonction pour valider un ticket (entrée à l'événement)
    function validateTicket(uint256 ticketId) external onlyOwner {
        require(ownerOf(ticketId) != address(0), "Ticket does not exist");
        require(!tickets[ticketId].isUsed, "Ticket already used"); // 🔥 Empêcher une double validation

        tickets[ticketId].isUsed = true; // 🔥 Marquer le ticket comme utilisé
    }

    /// 🔹 Vérifie si une adresse est un ancien propriétaire
    function isPreviousOwner(uint256 ticketId, address user) public view returns (bool) {
        for (uint i = 0; i < tickets[ticketId].previousOwners.length; i++) {
            if (tickets[ticketId].previousOwners[i] == user) {
                return true;
            }
        }
        return false;
    }

    /// 🔹 Vérifie si un ticket est valide pour son propriétaire actuel
    function isValidOwner(uint256 ticketId, address user) public view returns (bool) {
        return ownerOf(ticketId) == user && !tickets[ticketId].isUsed;
    }
}