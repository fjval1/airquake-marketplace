Moralis.Cloud.beforeSave("Listings", async function (request) {
    const confirmed = request.object.get("confirmed");
    if (confirmed) {
        request.object.set("active", true);
    } 
});

Moralis.Cloud.beforeSave("CanceledListings", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress")
    const tokenId = request.object.get("tokenId")
    if (confirmed) {
        let rowToUpdate = [{filter: {"tokenId" : tokenId, "NFTCollectionAddress":collectionAddress, 
        "active":true},
         update:{ "active" : false}}]
    Moralis.bulkUpdate("Listings", rowToUpdate)
    } 
});

Moralis.Cloud.beforeSave("ListingsSold", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress")
    const tokenId = request.object.get("tokenId")
    if (confirmed) {
        let rowToUpdate = [{filter: {"tokenId" : tokenId, "NFTCollectionAddress":collectionAddress, 
        "active":true},
         update:{ "active" : false}}]
    Moralis.bulkUpdate("Listings", rowToUpdate)
    } 
});