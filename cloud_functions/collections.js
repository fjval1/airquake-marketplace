
Moralis.Cloud.afterSave("NFTCollections", async function (request) {
    const confirmed = request.object.get("confirmed");
    const tx_hash = request.object.get("transaction_hash");
    if (confirmed) {
        const CollectionExtraData = Moralis.Object.extend("CollectionExtraData");
        const query = new Moralis.Query(CollectionExtraData);
        query.equalTo("hash", tx_hash);
        const result = await query.first();
        const thumbnail = result.get("thumbnail");
        request.object.set("thumbnail",thumbnail);
    } 
});
