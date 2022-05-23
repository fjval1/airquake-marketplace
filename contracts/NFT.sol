// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
//import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "./marketplace.sol";

// order of multiple inheritance matters for linearization, should be 
// “most base-like” to “most derived”
contract NFT is 
    Initializable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable
{

    using Strings for uint256;
    using Counters for Counters.Counter;

    event NftMinted(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        address indexed mintedTo,
        string tokenUri
    );
    
    address public authorAddress; 
    string public description; 
    Counters.Counter private _tokenIdCounter; 

    modifier onlyNFTCollectionAuthor() {
        require(
            authorAddress == msg.sender,
            "SIGNER IS NOT NFT COLLECTION AUTHOR"
        );
        _;
    }

    constructor() initializer {}
    
    function initialize(
        string calldata _name,
        string calldata _symbol,
        string calldata _description
    ) public payable initializer {
        __ERC721_init(_name, _symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        authorAddress = tx.origin;
        description = _description;
        _tokenIdCounter.increment();
    }
        
    /////////////////////////////////////
    // FUNCTIONS ////////////////////////
    /////////////////////////////////////

    function mintNft(string calldata _metadataUri)
        external
        onlyNFTCollectionAuthor
    {
        uint256 currentTokenId = _tokenIdCounter.current();
        _mint(authorAddress, currentTokenId);
        _setTokenURI(currentTokenId, _metadataUri);
        _tokenIdCounter.increment();
        emit NftMinted(address(this), currentTokenId, authorAddress, _metadataUri);
    }

    
    ////////////////////////////////////
    // OVERRIDES ///////////////////////
    ////////////////////////////////////
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}