import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    // 认证状态借口
    url: '/web/company/getStatus',
    method: 'get',
    response: () => {
      return successResponseWrap({
        traceId: null,
        code: 200,
        success: true,
        data: {
          companyStatus: 3,
          nodeStatus: 3,
        },
        message: '操作成功',
        err: null,
      });
    },
  },
  {
    // 认证提交
    url: '/web/company/saveOrUpdate',
    method: 'post',
    response: () => {
      return successResponseWrap({
        code: 200,
        success: '成功',
      });
    },
  },
  {
    // 认证详情
    url: '/web/company/info',
    method: 'get',
    response: () => {
      return successResponseWrap({
        traceId: null,
        code: 200,
        success: true,
        data: {
          id: '企业id',
          userId: '用户id',
          companyName: '企业名称',
          creditCode: '统一社会信用代码',
          contactName: '联系人名称',
          contactIdCard: '610423183403252689',
          idCardf: [
            'https://img2.baidu.com/it/u=494181536,671815496&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
          ],
          idCardz:
            'https://img2.baidu.com/it/u=494181536,671815496&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
          legalPersonName: '法人姓名',
          businessLicenseId:
            'https://img2.baidu.com/it/u=494181536,671815496&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
          certificateStatus: 0, // 认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
          remark: '驳回理由',
        },
        message: '操作成功',
        err: null,
      });
    },
  },
];
