
Moralis.Cloud.afterSave("WhitelistedCreators", async function (request) {
    const confirmed = request.object.get("confirmed");
    const tx_hash = request.object.get("transaction_hash");
    if (confirmed) {
        const CreatorExtraData = Moralis.Object.extend("CreatorExtraData");
        const query = new Moralis.Query(CreatorExtraData);
        query.equalTo("hash", tx_hash);
        const result = await query.first();
        if (result){
            const profilePic = result.get("profile_pic");
            request.object.set("profile_pic",profilePic)
        }
    } 
});
