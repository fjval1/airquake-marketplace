
Moralis.Cloud.beforeSave("PlacedOffers", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress");
    const tokenId = request.object.get("tokenId");
    const active = request.object.get("active");
    //add active===undefined to requirements so the update doesnt trigger the previous offerPlaced
    if (confirmed && active==undefined) {
        const PlacedOffers = Moralis.Object.extend("PlacedOffers");
        const offerQuery = new Moralis.Query(PlacedOffers);
        offerQuery.equalTo("tokenId", tokenId.toString());
        offerQuery.equalTo("NFTCollectionAddress", collectionAddress);
        offerQuery.equalTo("active", true);
        const previousOfferPlaced = await offerQuery.first();
        if (previousOfferPlaced) {
            previousOfferPlaced.set("active",false)
            await previousOfferPlaced.save()
        }
        request.object.set("active", true);
    } 
});


Moralis.Cloud.beforeSave("AcceptedOffers", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress")
    const tokenId = request.object.get("tokenId")
    if (confirmed) {
        //make previous listing inactive
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
 
        const PlacedOffers = Moralis.Object.extend("PlacedOffers");
        const offerQuery = new Moralis.Query(PlacedOffers);
        offerQuery.equalTo("tokenId", tokenId.toString());
        offerQuery.equalTo("NFTCollectionAddress", collectionAddress);
        offerQuery.equalTo("active", true);
        const previousOfferPlaced = await offerQuery.first();
        if (previousOfferPlaced) {
            previousOfferPlaced.set("active",false)
            await previousOfferPlaced.save()
        }

    } 
});

Moralis.Cloud.beforeSave("CanceledOffers", async function (request) {
    const confirmed = request.object.get("confirmed");
    const collectionAddress = request.object.get("NFTCollectionAddress");
    const tokenId = request.object.get("tokenId");
    if (confirmed) {
        //make previous offer inactive
        const PlacedOffers = Moralis.Object.extend("PlacedOffers");
        const offerQuery = new Moralis.Query(PlacedOffers);
        offerQuery.equalTo("tokenId", tokenId.toString());
        offerQuery.equalTo("NFTCollectionAddress", collectionAddress);
        offerQuery.equalTo("active", true);
        const previousOfferPlaced = await offerQuery.first();
        if (previousOfferPlaced) {
            previousOfferPlaced.set("active",false);
            await previousOfferPlaced.save();
        }
    }
});
