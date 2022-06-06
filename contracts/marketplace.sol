pragma solidity ^0.8.12;


import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFT.sol";

contract Marketplace is ReentrancyGuard, Ownable {

    using Counters for Counters.Counter;
    //using EnumerableSet for EnumerableSet.AddressSet;

    /////////////////////////////////////
    // EVENTS ////////////////////////
    /////////////////////////////////////

    event WhitelistCreator(address indexed creator);

    event NFTCollectionCreated(
        address indexed contractAddr,
        address indexed author,
        string name,
        string description, 
        string symbol
    );

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
    // STATE VARIABLES ////////////////////////
    /////////////////////////////////////

    //EnumerableSet.AddressSet private _nftContractAddrs; 
    address[] private _nftContractAddrs;
    address public NFTCollectionImplementation;

    // Mapping from nftCollectionAddress to mapping of tokenId to Listing.
    mapping(address => mapping(uint256 => Listing)) listings;
    
    // Mapping from nftCollectionAddress to mapping of tokenId to Offer.
    mapping(address => mapping(uint256 => Offer)) offers;

    mapping(address => bool) private creatorWhitelist;

    /////////////////////////////////////
    // MODIFIERS ////////////////////////
    /////////////////////////////////////

    modifier callerMustBeTokenOwner(address collectionAddress, uint256 tokenId){
        NFT nft = NFT(collectionAddress);
        require(nft.ownerOf(tokenId) == msg.sender,"Caller does not own the token");
        _;
    }

    modifier callerMustNotBeTokenOwner(address collectionAddress, uint256 tokenId){
        NFT nft = NFT(collectionAddress);
        require(nft.ownerOf(tokenId) != msg.sender,"Caller owns the token");
        _;
    }

    modifier ownerMustHaveMarketplaceApprovedAsOperator(address collectionAddress,uint256 tokenId)  {
        NFT nft = NFT(collectionAddress);
        address owner = nft.ownerOf(tokenId);
        require(nft.isApprovedForAll(owner, address(this)),"Token owner hasn't approved the marketplace as operator");
        _;
    }

    modifier onlyCreator() {
        require(creatorWhitelist[msg.sender] == true, "Caller must be a creator");
        _;
    }




    /////////////////////////////////////
    // FUNCTIONS ////////////////////////
    /////////////////////////////////////

    constructor(
        address _NFTCollectionImplementation
    ) payable {
        NFTCollectionImplementation = _NFTCollectionImplementation;
    }

    function addCreatorToWhitelist(address creator) public onlyOwner {
      creatorWhitelist[creator] = true;
      emit WhitelistCreator(creator);
    }
    // TODO: DEBERIA HABER UNA FUNCION REMOVE CREATOR?

    function createNftContract(
        string calldata name,
        string calldata symbol,
        string calldata description
    ) external onlyCreator nonReentrant {
        address clonedNFTCollectionAddress = Clones.clone(NFTCollectionImplementation);
        NFT(clonedNFTCollectionAddress).initialize(
            name,
            symbol,
            description
        );
        //_nftContractAddrs.add(clonedNFTCollectionAddress);
        _nftContractAddrs.push(clonedNFTCollectionAddress);
        emit NFTCollectionCreated(clonedNFTCollectionAddress, msg.sender, name, description, symbol);
    }

    
    function setListing(uint256 price, address NFTCollectionAddress, uint256 tokenId) 
    callerMustBeTokenOwner(NFTCollectionAddress,tokenId) 
    ownerMustHaveMarketplaceApprovedAsOperator(NFTCollectionAddress,tokenId) 
    external {
        listings[NFTCollectionAddress][tokenId] = Listing(price,payable(msg.sender));
        emit SetListing(NFTCollectionAddress,tokenId,msg.sender,price);
    }

    /* TODO: add requirement that there must be a listing in order to cancel it
    */ 
    function cancelListing(
        address NFTCollectionAddress,
        uint256 tokenId
    ) 
    callerMustBeTokenOwner(NFTCollectionAddress,tokenId)
    
    external {
        delete listings[NFTCollectionAddress][tokenId];
        emit CancelListing(NFTCollectionAddress,tokenId,msg.sender);
    }

    function buy(address NFTCollectionAddress, uint256 tokenId) 
    ownerMustHaveMarketplaceApprovedAsOperator(NFTCollectionAddress,tokenId)
    public payable nonReentrant {
        Listing memory listing = listings[NFTCollectionAddress][tokenId];
        //requisites
        // 1. Currrent owner must equal seller
        NFT nft = NFT(NFTCollectionAddress);
        address tokenOwner = nft.ownerOf(tokenId);
        require(tokenOwner == listing.seller, "Listing setter is different from current owner");
        // 2. Buyer has necessary funds
        require(msg.value == listing.price, "Insufficient funds");
        // 3. buyer is different from seller
        require(msg.sender != listing.seller);
        // 4. price is bigger than 0 (equivalent to requiring that a price has been set)
        require(listing.price > 0);

        delete listings[NFTCollectionAddress][tokenId];
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];

        //if the buyer had placed an offer before, that offer gets cancelled and his money returned
        if (currOffer.buyer == msg.sender) {
            delete offers[NFTCollectionAddress][tokenId];
            currOffer.buyer.transfer(currOffer.price);
        }
        //transfer NFT to buyer
        NFT NFTCollection = NFT(NFTCollectionAddress);
        NFTCollection.safeTransferFrom(listing.seller,msg.sender,tokenId);
        //transfer money to seller
        listing.seller.transfer(msg.value);

        //TODO: mark if first sell

        emit Sold(NFTCollectionAddress,msg.sender,listing.seller,tokenId,listing.price);
        
    }

    //TODO: ver si se debe restringir que el ofertante no sea el dueño actual
    function offer(
        address NFTCollectionAddress,
        uint256 tokenId
    ) external payable nonReentrant
    {
        require(msg.value > 0, "Offer amount cannot be 0");
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
    ) external nonReentrant {
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];
        require(currOffer.price != 0,"cancelOffer::No offer for currency exists.");
        require(currOffer.buyer == msg.sender,"cancelOffer::Sender must have placed the offer.");

        delete offers[NFTCollectionAddress][tokenId];
        //refund the money
        currOffer.buyer.transfer(currOffer.price);
        emit CancelOffer(NFTCollectionAddress,msg.sender,currOffer.price,tokenId);
    }

    //ver si se debe revisar que la oferta no haya sido hecha por el dueño actual 
    function acceptOffer(
        address NFTCollectionAddress,
        uint256 tokenId
    ) external nonReentrant 
    
    callerMustBeTokenOwner(NFTCollectionAddress,tokenId)
    ownerMustHaveMarketplaceApprovedAsOperator(NFTCollectionAddress,tokenId)
    {
        Offer memory currOffer = offers[NFTCollectionAddress][tokenId];
        require(currOffer.price != 0, "acceptOffer::No offer exists");

        delete listings[NFTCollectionAddress][tokenId];
        delete offers[NFTCollectionAddress][tokenId];
        //transfer NFT to buyer
        NFT nft = NFT(NFTCollectionAddress);
        nft.safeTransferFrom(msg.sender, currOffer.buyer, tokenId);
        //transfer money to seller
        payable(msg.sender).transfer(currOffer.price);
        emit AcceptOffer(NFTCollectionAddress,currOffer.buyer,msg.sender,currOffer.price,tokenId);
    }


    /* TODO: function to withdraw marketplace funds 
    function withdraw(uint256 amount, address payable destinationAddress) public{      
    }
    */


}