//set active variable as true and set previous listings as false (case when a user updates a listing)

Moralis.Cloud.beforeSave("PlacedListings", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress");
    const tokenId = request.object.get("tokenId");
    const active = request.object.get("active");
    //add active===undefined to requirements so the update doesnt trigger the previous listing
    if (confirmed && active===undefined) {
        const Listings = Moralis.Object.extend("PlacedListings");
        const query = new Moralis.Query(Listings);
        query.equalTo("tokenId", tokenId.toString());
        query.equalTo("NFTCollectionAddress", collectionAddress);
        query.equalTo("active", true);
        const previousActiveListing = await query.first();
        if (previousActiveListing) {
            previousActiveListing.set("active",false)
            await previousActiveListing.save()
        }
        request.object.set("active", true);
    } 
});

Moralis.Cloud.beforeSave("CanceledListings", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress")
    const tokenId = request.object.get("tokenId")
    if (confirmed) {
        const Listings = Moralis.Object.extend("PlacedListings");
        const query = new Moralis.Query(Listings);
        query.equalTo("tokenId", tokenId.toString());
        query.equalTo("NFTCollectionAddress", collectionAddress);
        query.equalTo("active", true);
        const previousActiveListing = await query.first();
        if (previousActiveListing) {
                previousActiveListing.set("active",false)
                await previousActiveListing.save()
        }
    } 
});

Moralis.Cloud.afterSave("SoldListings", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress")
    const tokenId = request.object.get("tokenId")
    if (confirmed) {
        let rowToUpdate = [{filter: {"tokenId" : tokenId, "NFTCollectionAddress":collectionAddress, 
        "active":true},
         update:{ "active" : false}}]
    Moralis.bulkUpdate("PlacedListings", rowToUpdate)
    } 
});
