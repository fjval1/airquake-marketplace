// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFT.sol";

contract Marketplace is ReentrancyGuard, Ownable {

    using Counters for Counters.Counter;

    ////////////////////////////////////
    // EVENTS //////////////////////////
    ////////////////////////////////////

    event WhitelistCreator(address indexed creator);

    event UnWhitelistCreator(address indexed creator);

    event NFTCollectionCreated(
        address indexed contractAddr,
        address indexed author,
        string name,
        string symbol
    );

    event ExternalNFTCollectionAdded(address NFTCollectionAddress);

    event SetListing(
        address indexed NFTCollectionAddress,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event CancelListing(
        address indexed NFTCollectionAddress,
        uint256 indexed tokenId,
        address caller
    );

    event Sold(
        address indexed NFTCollectionAddress,
        address indexed buyer,
        address seller,
        uint256 indexed tokenId,
        uint256 price
    );

    event OfferPlaced(
        address indexed NFTCollectionAddress,
        address indexed bidder,
        uint256 amount,
        uint256 indexed tokenId
    );

    event AcceptOffer(
        address indexed NFTCollectionAddress,
        address indexed buyer,
        address seller,
        uint256 amount,
        uint256 indexed tokenId
    );

    event CancelOffer(
        address indexed NFTCollectionAddress,
        address indexed bidder,
        uint256 amount,
        uint256 indexed tokenId
    );

    /////////////////////////////////////
    // STRUCTS ////////////////////////
    /////////////////////////////////////

    struct Listing {
        uint256 price;
        address payable seller; 
    }

    struct Offer {
        address payable buyer;
        uint256 price;
    }


    /////////////////////////////////////
    // STATE VARIABLES //////////////////
    /////////////////////////////////////

    mapping(address => bool) validNFTCollectionAddresses;
    address public NFTCollectionImplementation;
    //all percentages are 10*desired percentage. For example, percentage==30 means 3% fee 
    uint256 marketplaceSecondaryPercentage = 30; // 3%
    uint256 creatorSecondaryPercentage = 100; // 10%
    uint256 marketplacePrimaryPercentage = 125; // 12.5%

    // Mapping from NFTCollectionAddress to mapping of tokenId to Listing.
    mapping(address => mapping(uint256 => Listing)) listings;
    
    // Mapping from nftCollectionAddress to mapping of tokenId to Offer.
    mapping(address => mapping(uint256 => Offer)) offers;

    mapping(address => bool) private creatorWhitelist;

    // Mapping from NFTCollectionAddress to ID to that collection's creator
    mapping(address => address) private collectionCreator;

    // Mapping from NFTCollectionAddress to mapping of token ID to bool 
    // indicating whether the token has been sold before.
    mapping(address => mapping(uint256 => bool)) private tokenSoldBefore;
    
    // Money that can be safely withdrawn without affecting the functioning of the marketplace 
    // (for example, avoids the withdrawal of money that was deposited by an offer)
    uint256 marketplaceEarnings;
    

    /////////////////////////////////////
    // MODIFIERS ////////////////////////
    /////////////////////////////////////

    modifier callerMustBeTokenOwner(address NFTCollectionAddress, uint256 tokenId){
        NFT nft = NFT(NFTCollectionAddress);
        require(nft.ownerOf(tokenId) == msg.sender,"Caller does not own the token");
        _;
    }

    modifier callerMustNotBeTokenOwner(address NFTCollectionAddress, uint256 tokenId){
        NFT nft = NFT(NFTCollectionAddress);
        require(nft.ownerOf(tokenId) != msg.sender,"Caller owns the token");
        _;
    }

    modifier onlyCreator() {
        require(creatorWhitelist[msg.sender] == true, "Caller must be a creator");
        _;
    }

    modifier isValidNFTCollection(address NFTCollectionAddress) {
        require(validNFTCollectionAddresses[NFTCollectionAddress],"NFT Collection hasn't been approved in the marketplace");
        _;
    }

    /////////////////////////////////////
    // FUNCTIONS ////////////////////////
    /////////////////////////////////////

    constructor(address _NFTCollectionImplementation) 
        payable {
        NFTCollectionImplementation = _NFTCollectionImplementation;
    }

    function addCreatorToWhitelist(address creator) external onlyOwner {
      creatorWhitelist[creator] = true;
      emit WhitelistCreator(creator);
    }

    function removeCreatorFromWhitelist(address creator) external onlyOwner {
      delete creatorWhitelist[creator];
      emit UnWhitelistCreator(creator);
    }

    function createNFTCollection(string calldata name,string calldata symbol) 
    external onlyCreator nonReentrant {
        address clonedNFTCollectionAddress = Clones.clone(NFTCollectionImplementation);
        NFT(clonedNFTCollectionAddress).initialize(
            name,
            symbol
        );
        validNFTCollectionAddresses[clonedNFTCollectionAddress] = true;
        emit NFTCollectionCreated(clonedNFTCollectionAddress, msg.sender, name, symbol);
    }

    function addExternalNFTCollection(address externalNFTCollectionAddress) 
        external onlyOwner nonReentrant {
        validNFTCollectionAddresses[externalNFTCollectionAddress] = true;
        emit ExternalNFTCollectionAdded(externalNFTCollectionAddress);
    }

    function setListing(uint256 price, address NFTCollectionAddress, uint256 tokenId) 
    callerMustBeTokenOwner(NFTCollectionAddress,tokenId) 
    isValidNFTCollection(NFTCollectionAddress)
    external {
        listings[NFTCollectionAddress][tokenId] = Listing(price,payable(msg.sender));
        emit SetListing(NFTCollectionAddress,tokenId,msg.sender,price);
    }

    function cancelListing(
        address NFTCollectionAddress,
        uint256 tokenId
    ) 
    isValidNFTCollection(NFTCollectionAddress)
    callerMustBeTokenOwner(NFTCollectionAddress,tokenId)
    external {
        require(listings[NFTCollectionAddress][tokenId].price > 0,"No listing exists");
        delete listings[NFTCollectionAddress][tokenId];
        emit CancelListing(NFTCollectionAddress,tokenId,msg.sender);
    }

    function buy(address NFTCollectionAddress, uint256 tokenId) 
    isValidNFTCollection(NFTCollectionAddress)
    external payable nonReentrant {
        Listing memory listing = listings[NFTCollectionAddress][tokenId];
        //requisites
        NFT nft = NFT(NFTCollectionAddress);
        address tokenOwner = nft.ownerOf(tokenId);
        require(tokenOwner == listing.seller, "Listing setter is different from current owner");
        require(msg.value == listing.price, "Insufficient funds");
        require(msg.sender != listing.seller,"Buyer must be different from seller");
        require(listing.price > 0);

        delete listings[NFTCollectionAddress][tokenId];
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];

        //if the buyer had placed an offer before, that offer gets canceled and his money returned
        if (currOffer.buyer == msg.sender) {
            delete offers[NFTCollectionAddress][tokenId];
            currOffer.buyer.transfer(currOffer.price);
        }
        //transfer NFT to buyer
        NFT NFTCollection = NFT(NFTCollectionAddress);
        NFTCollection.safeTransferFrom(listing.seller,msg.sender,tokenId);
        _payout(msg.value, tokenOwner,NFTCollectionAddress, tokenId);
        tokenSoldBefore[NFTCollectionAddress][tokenId] = true;
        emit Sold(NFTCollectionAddress,msg.sender,listing.seller,tokenId,listing.price);
        
    }

    function offer(
        address NFTCollectionAddress,
        uint256 tokenId
    )
    isValidNFTCollection(NFTCollectionAddress) 
    callerMustNotBeTokenOwner(NFTCollectionAddress,tokenId)
    external 
    payable 
    nonReentrant
    {
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];
        require(msg.value > currOffer.price, "Offer must be higher than previous one");
        //refund to previous offerer
        currOffer.buyer.transfer(currOffer.price);
        offers[NFTCollectionAddress][tokenId] = Offer(payable(msg.sender),msg.value);
        emit OfferPlaced(NFTCollectionAddress,msg.sender,msg.value,tokenId);
        
    }

    function cancelOffer(
        address NFTCollectionAddress,
        uint256 tokenId
    )
    isValidNFTCollection(NFTCollectionAddress) 
    external 
    nonReentrant 
    {
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];
        require(currOffer.price > 0,"No offer exists");
        require(currOffer.buyer == msg.sender,"Sender must have placed the offer");
        delete offers[NFTCollectionAddress][tokenId];
        //refund the money
        currOffer.buyer.transfer(currOffer.price);
        emit CancelOffer(NFTCollectionAddress,msg.sender,currOffer.price,tokenId);
    }

    function acceptOffer(
        address NFTCollectionAddress,
        uint256 tokenId
    ) external nonReentrant 
    isValidNFTCollection(NFTCollectionAddress)
    callerMustBeTokenOwner(NFTCollectionAddress,tokenId)
    {
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];
        require(currOffer.price > 0, "No offer exists");

        delete listings[NFTCollectionAddress][tokenId];
        delete offers[NFTCollectionAddress][tokenId];
        //transfer NFT to buyer
        NFT nft = NFT(NFTCollectionAddress);
        nft.safeTransferFrom(msg.sender, currOffer.buyer, tokenId);
        //transfer money to seller, marketplace and creator
        _payout(currOffer.price,msg.sender,NFTCollectionAddress,tokenId);
        tokenSoldBefore[NFTCollectionAddress][tokenId] = true;
        emit AcceptOffer(NFTCollectionAddress,currOffer.buyer,msg.sender,currOffer.price,tokenId);
    }

    function _payout(uint256 val, address tokenOwner, 
    address NFTCollectionAddress, uint256 tokenId) private {
        uint256 marketplacePayment;
        uint256 creatorPayment;
        uint256 ownerPayment;
        address creator = collectionCreator[NFTCollectionAddress];
        if (tokenSoldBefore[NFTCollectionAddress][tokenId]) {
            // marketplace gets 3%, creator gets 10%, owner gets 87%
            marketplacePayment = val*marketplaceSecondaryPercentage/1000;
            creatorPayment = val*creatorSecondaryPercentage/1000;
            ownerPayment = val-creatorPayment-marketplacePayment;  
            marketplaceEarnings += marketplacePayment;           
            payable(creator).transfer(creatorPayment);
            payable(tokenOwner).transfer(ownerPayment);
        } else {
            // marketplace gets 15%, creator/owner gets 85%
            marketplacePayment = val*marketplacePrimaryPercentage/1000;
            creatorPayment = val-marketplacePayment;
            marketplaceEarnings += marketplacePayment;
            payable(creator).transfer(creatorPayment);
        }
        
      
    }

    function withdraw(uint256 amount, address payable destinationAddress) onlyOwner nonReentrant public{
        require(amount <= marketplaceEarnings);     
        require(amount <= address(this).balance, "Insufficient funds to withdraw");
        marketplaceEarnings -= amount;
        destinationAddress.transfer(amount);  
    }
    


}