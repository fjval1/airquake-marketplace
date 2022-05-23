pragma solidity ^0.8.12;


import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFT.sol";

contract AirQuakeMarketplace is ReentrancyGuard, Ownable {

    using Counters for Counters.Counter;
    //using EnumerableSet for EnumerableSet.AddressSet;

    event NftContractCreated(
        address indexed contractAddr,
        address indexed author
    );

    struct Listing {
        uint256 price;
        address seller; 
    }

    //EnumerableSet.AddressSet private _nftContractAddrs; 
    address[] private _nftContractAddrs;
    address public NFTCollectionImplementation;
    mapping(address => mapping(uint256 => Listing)) listings;
    mapping(address => uint256) balances;
    constructor(
        address _NFTCollectionImplementation
    ) payable {
        NFTCollectionImplementation = _NFTCollectionImplementation;
    }

    /////////////////////////////////////
    // MODIFIERS ////////////////////////
    /////////////////////////////////////




    /////////////////////////////////////
    // FUNCTIONS ////////////////////////
    /////////////////////////////////////

    function createNftContract(
        string calldata _name,
        string calldata _symbol,
        string calldata _description
    ) external nonReentrant {
        address clonedNFTCollectionAddress = Clones.clone(NFTCollectionImplementation);
        NFT(clonedNFTCollectionAddress).initialize(
            _name,
            _symbol,
            _description
        );
        //_nftContractAddrs.add(clonedNFTCollectionAddress);
        _nftContractAddrs.push(clonedNFTCollectionAddress);
        emit NftContractCreated(clonedNFTCollectionAddress, msg.sender);
    }

    function addListing(uint256 price, address NFTCollectionAddress, uint256 tokenId) public {
        NFT NFTCollection = NFT(NFTCollectionAddress);
        require(NFTCollection.ownerOf(tokenId) == msg.sender, "Caller must own the token");
        require(NFTCollection.isApprovedForAll(msg.sender,address(this)), "NFT Collection must be approved");
        listings[NFTCollectionAddress][tokenId] = Listing(price,msg.sender);
    }

    function buy(address NFTCollectionAddress, uint256 tokenId) public payable {
        Listing memory listing = listings[NFTCollectionAddress][tokenId];
        require(msg.value > listing.price, "Insufficient funds");
        delete listings[NFTCollectionAddress][tokenId];
        balances[listing.seller] += msg.value;
        NFT NFTCollection = NFT(NFTCollectionAddress);
        NFTCollection.safeTransferFrom(listing.seller,msg.sender,tokenId);
    }

    function withdraw(uint256 amount, address payable destinationAddress) public{
        require(amount <= balances[msg.sender],"Insufficient funds");
        balances[msg.sender] -= amount;
        destinationAddress.transfer(amount);       
    }

    function getNFTContractAddresses()public view returns(address[] memory){
        return _nftContractAddrs;
    }

}
