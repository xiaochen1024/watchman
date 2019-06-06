const ENUM_NAME_MAP = {
  0: '审核中',
  1: '审核通过',
  2: '审核拒绝',
};

class ApplyStatus {
  static APPLY_REVIEWING = 0;
  static APPLY_APPROVED = 1;
  static APPLY_REJECTED = 2;

  static getName(e) {
    return ENUM_NAME_MAP[e];
  }
}

module.exports = ApplyStatus;