import { successResponseWrap } from './response';

export default [
  {
    url: '/server/web/file/selectPageList',
    method: 'post',
    response: () =>
      successResponseWrap({
        total: 18,
        records: [
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '51c5559f-7e2c-408d-8f4e-02c8b7c367d6.jpg',
          '51c5559f-7e2c-408d-8f4e-02c8b7c367d6.jpg',
          '51c5559f-7e2c-408d-8f4e-02c8b7c367d6.jpg',
          '51c5559f-7e2c-408d-8f4e-02c8b7c367d6.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
          '1f746fd5-db3e-485f-9292-253fe8720f2e.jpg',
        ],
      }),
  },
  {
    url: '/server/web/file/deleteByName',
    method: 'post',
    response: () => successResponseWrap({}),
  },
];
