export const networkCollections = {
  
  "0x13881": [
    {
      image:
        "https://lh3.googleusercontent.com/sCktmhddBePRNRfmG4cJ5Tbf-Ht4r8X3dCeBEKJ_Cau8FJ4HcS_7eY49H2prW_PndY8JSx-4CVQs5wgmlxJsLlKP=s0",
      name: "Rinkeby Bricks",
      addrs: "0xe0d8d7b8273de14e628d2f2a4a10f719f898450a",
    },
    {
      image:
        "https://lh3.googleusercontent.com/B54ESgO4A9fgU8QX5P8k1mKHDzTmjHf1rUV6TVBXY-zKhgPKJfzxTGg8zMoSZJr53Fje6nE0Iu5XFgBjE2HU-6QmZA=s0",
      name: "Rinkeby Moons",
      addrs: "0xdf82c9014f127243ce1305dfe54151647d74b27a",
    },
  ],
};

export const getCollectionsByChain = (chainId) => {
  //const Collection = Moralis.Object.extend("Collection");
  //const query = new Moralis.Query(Collection);
  //const results = await query.find();
  //alert("Successfully retrieved " + results.length + " collections.");
  return networkCollections[chainId]
}
