// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Ticketing is ERC721, Ownable {
    struct Match {
        uint256 matchId;
        string title;
        uint256 startTime;
        uint256 totalSeats;
        uint256 soldSeats;
        string[] tags;
    }

    struct Ticket {
        uint256 matchId;
        uint256 price;
        bool isUsed;
        address owner;
    }

    uint256 public nextMatchId = 1;
    uint256 public nextTicketId = 1;
    
    mapping(uint256 => Match) public matches;
    mapping(uint256 => Ticket) public tickets;

    constructor() ERC721("EventTicket", "TICKET") Ownable() {}

    /// 🔹 **Créer un match**
    function createMatch(
        string memory title,
        uint256 startTime,
        uint256 totalSeats,
        string[] memory tags
    ) external onlyOwner {
        require(totalSeats > 0, "Le match doit avoir des places dispo");

        matches[nextMatchId] = Match({
            matchId: nextMatchId,
            title: title,
            startTime: startTime,
            totalSeats: totalSeats,
            soldSeats: 0,
            tags: tags
        });

        nextMatchId++;
    }

    /// 🔹 **Acheter un ticket pour un match**
    function buyTicket(uint256 matchId, uint256 price) external {
        require(matches[matchId].matchId != 0, "Match non existant");
        require(matches[matchId].soldSeats < matches[matchId].totalSeats, "Plus de places disponibles");

        tickets[nextTicketId] = Ticket({
            matchId: matchId,
            price: price,
            isUsed: false,
            owner: msg.sender
        });

        _safeMint(msg.sender, nextTicketId);
        matches[matchId].soldSeats++;

        nextTicketId++;
    }

    /// 🔹 **Voir les places restantes pour un match**
    function getRemainingSeats(uint256 matchId) public view returns (uint256) {
        require(matches[matchId].matchId != 0, "Match non existant");
        return matches[matchId].totalSeats - matches[matchId].soldSeats;
    }

    /// 🔹 **Lister tous les matchs disponibles**
    function getAllMatches() public view returns (Match[] memory) {
        Match[] memory allMatches = new Match[](nextMatchId - 1);
        for (uint256 i = 1; i < nextMatchId; i++) {
            allMatches[i - 1] = matches[i];
        }
        return allMatches;
    }
}