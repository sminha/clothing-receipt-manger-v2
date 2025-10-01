export function generateTestData(count: number) {
  const data = [];

  const pad = (num: number, size: number) => num.toString().padStart(size, '0');

  for (let i = 0; i < count; i++) {
    const purchaseId = pad(i + 1, 5);
    const date = ['2025-09-01T01:30', '2025-09-04T03:20', '2025-09-13T00:10', '2025-09-18T05:50', '2025-09-22T02:00', '2025-09-25T04:30'][(i + 1) % 6];
    const createdAt = ['2025-09-26T15:30:00.000Z', '2025-09-27T16:20:00.000Z', '2025-09-28T09:40:00.000Z', '2025-09-29T12:21:30.000Z', '2025-10-01T13:00:00.000Z'][(i + 1) % 5];

    const items = [];
    for (let j = 0; j < (i + 1) % 5; j++) {
      const itemId = `${purchaseId}${pad(j + 1, 3)}`
      const unitPrice = [8000, 11000, 13000, 14000, 18000, 23000][(i + 1) % 6];
      const quantity = [2, 3, 5, 8, 12, 16][(i + 1) % 6];

      items.push({
        itemId,
        name: `상품 ${i + 1}${j + 1}`,
        category: ['아우터', '상의', '바지', '스커트', '원피스', '슈즈', '가방'][(i + 1) % 7],
        color: ['아이보리', '그레이', '차콜', '블랙', '화이트'][(i + 1) % 5],
        size: ['S', 'M', 'L', 'FREE', 'ONE SIZE'][(i + 1) % 5],
        options: '',
        unitPrice,
        quantity,
        totalAmount: unitPrice * quantity,
        missingQuantity: quantity - 2,
      });
    }

    data.push({
      id: purchaseId,
      date,
      createdAt,
      vendor: `거래처 ${i + 1}`,
      items,
      receiptImage: '',
    })
  }

  return data;
}