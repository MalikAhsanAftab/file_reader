let app = require("./../../index");

it('Should not fetch any transaction for invalid sku', async() => {
    let data = await app.calculateStockQuantity("invalid_sku");
    console.log("Whhats in data " , data );
    expect(data).toBe(true)
})