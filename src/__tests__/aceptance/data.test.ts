import * as app from './../../index';

it('Should not fetch any transaction for invalid sku', async() => {
    let data = await app.calculateStockQuantity("invalid_sku");
    expect(data.sku).toBe( "invalid_sku")
})