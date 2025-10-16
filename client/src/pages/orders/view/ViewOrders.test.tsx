import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import ViewOrders from './ViewOrders.tsx';

const mockStore = configureStore([]);

const samplePurchaseList = [
  {
    id: '00001',
    date: '2025-09-01T01:30',
    createdAt: '2025-09-04T12:00:00.000Z',
    vendor: '루프',
    items: [
      {
        itemId: '00001001',
        name: '브이넥t',
        category: '상의',
        color: '블랙',
        size: 'ONE SIZE',
        options: '',
        unitPrice: 8000,
        quantity: 3,
        totalAmount: 24000,
        missingQuantity: 3,
      },
      {
        itemId: '00001002',
        name: '브이넥t',
        category: '상의',
        color: '화이트',
        size: 'ONE SIZE',
        options: '',
        unitPrice: 8000,
        quantity: 4,
        totalAmount: 32000,
        missingQuantity: 2,
      },
      {
        itemId: '00001003',
        name: '나그랑t',
        category: '상의',
        color: '그레이',
        size: 'M',
        options: '',
        unitPrice: 9000,
        quantity: 2,
        totalAmount: 18000,
        missingQuantity: 0,
      },
    ],
    receiptImage: '',
  },
  {
    id: '00002',
    date: '2025-09-02T01:30',
    createdAt: '2025-09-03T12:00:00.000Z',
    vendor: '안즈',
    items: [
      {
        itemId: '00002001',
        name: '부츠컷팬츠',
        category: '하의',
        color: '중청',
        size: 'M',
        options: '',
        unitPrice: 23000,
        quantity: 3,
        totalAmount: 69000,
        missingQuantity: 1,
      },
      {
        itemId: '00002002',
        name: '부츠컷팬츠',
        category: '하의',
        color: '흑청',
        size: 'M',
        options: '',
        unitPrice: 23000,
        quantity: 4,
        totalAmount: 92000,
        missingQuantity: 2,
      },
    ],
    receiptImage: '',
  },
  {
    id: '00003',
    date: '2025-08-31T01:30',
    createdAt: '2025-09-10T12:00:00.000Z',
    vendor: '미우',
    items: [
      {
        itemId: '00003001',
        name: '레오파드백',
        category: '가방',
        color: '차콜',
        size: 'FREE',
        options: '',
        unitPrice: 12000,
        quantity: 7,
        totalAmount: 84000,
        missingQuantity: 5,
      },
      {
        itemId: '00003002',
        name: '에스닉벨트',
        category: '패션잡화',
        color: 'ONE COLOR',
        size: 'ONE SIZE',
        options: '',
        unitPrice: 7000,
        quantity: 3,
        totalAmount: 21000,
        missingQuantity: 0,
      },
      {
        itemId: '00003003',
        name: '골지발목양말',
        category: '패션잡화',
        color: '화이트',
        size: 'ONE SIZE',
        options: '',
        unitPrice: 800,
        quantity: 10,
        totalAmount: 8000,
        missingQuantity: 4,
      },
    ],
    receiptImage: '',
  },
];

function setup(initialRecords = samplePurchaseList) {
  const store = mockStore({
    user: { 
      company: '가나',
      name: '홍길동',
      birth: '000317',
      gender: 'male',
      carrier: 'KT',
      phone: '01085907408',
    },
    purchase: {
      records: initialRecords,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ViewOrders />
      </MemoryRouter>
    </Provider>
  );
}

describe('조회기간 검색 테스트', () => {
  
});

describe('상세조건 검색 테스트', () => {

});

describe('정렬 테스트', () => {
  const sortOptions = ['사입일시 기준', '거래처명 기준', '상품명 기준', '미송수량 기준'];
  const directions = ['오름차순', '내림차순'];

  sortOptions.forEach((sortOption) => {
    directions.forEach((direction) => {
      test(`정렬 기준: ${sortOption}, 정렬 방향: ${direction}`, async () => {
        setup();

        const user = userEvent.setup();

        const dropdownButtons = screen.getAllByText((content) => /기준|순/.test(content));

        await user.click(dropdownButtons[0]); // 정렬 기준 드롭다운 열기
        const sortLiElements = await screen.findAllByText(sortOption);
        const sortOptionElement = sortLiElements.find(el => el.tagName.toLowerCase() === 'li');
        if (!sortOptionElement) throw new Error(`Option '${sortOption}' not found`);
        await user.click(sortOptionElement); // 정렬 기준 드롭다운 선택

        await user.click(dropdownButtons[1]); // 정렬 방향 드롭다운 열기
        const dirLiElements = await screen.getAllByText(direction);
        const directionElement = dirLiElements.find(el => el.tagName.toLowerCase() === 'li');
        if (!directionElement) throw new Error(`Option '${direction}' not found`);
        await user.click(directionElement); // 정렬 방향 드롭다운 선택

        const rows = await screen.findAllByRole('row');
        const dataRows = rows.slice(1);
        expect(dataRows.length).toBeGreaterThan(0);

        switch (sortOption) {
          case '사입일시 기준':
            expect(dataRows.map(row => row.querySelector('td:nth-child(4)')?.textContent))
              .toEqual(direction === '오름차순'
                ? ['2025.08.31 01:30', '2025.08.31 01:30', '2025.08.31 01:30', '2025.09.01 01:30', '2025.09.01 01:30', '2025.09.01 01:30', '2025.09.02 01:30', '2025.09.02 01:30']
                : ['2025.09.02 01:30', '2025.09.02 01:30', '2025.09.01 01:30', '2025.09.01 01:30', '2025.09.01 01:30', '2025.08.31 01:30', '2025.08.31 01:30', '2025.08.31 01:30']
              )
            break;
          case '거래처명 기준':
            expect(dataRows.map(row => row.querySelector('td:nth-child(5)')?.textContent))
              .toEqual(direction === '오름차순'
                ? ['루프', '루프', '루프', '미우', '미우', '미우', '안즈', '안즈']
                : ['안즈', '안즈', '미우', '미우', '미우', '루프', '루프', '루프']
            );
            break;
          case '상품명 기준':
            expect(dataRows.map(row => row.querySelector('td:nth-child(6)')?.textContent))
            .toEqual(direction === '오름차순'
              ? ['골지발목양말', '나그랑t', '레오파드백', '부츠컷팬츠', '부츠컷팬츠', '브이넥t', '브이넥t', '에스닉벨트']
              : ['에스닉벨트', '브이넥t', '브이넥t', '부츠컷팬츠', '부츠컷팬츠', '레오파드백', '나그랑t', '골지발목양말']
            );
            break;
          case '미송수량 기준':
            expect(dataRows.map(row => row.querySelector('td:nth-child(14)')?.textContent))
              .toEqual(direction === '오름차순'
                ? ['0', '0', '1', '2', '2', '3', '4', '5']
                : ['5', '4', '3', '2', '2', '1', '0', '0']
              )
            break;
        }
      });
    });
  });
});