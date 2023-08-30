const tools = {
  commentCountCheck: (comment) => {
    if (comment.comment.includes('.')) {
      return true;
    }
    const numberFormat = comment.comment.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    if (
      !isNaN(numberFormat) &&
      Number(numberFormat) >= 0 &&
      Number(numberFormat) <= 50
    ) {
      return false;
    } else {
      return true;
    }
  },
  giftUrlCheck: (gift, giftList) => {
    if (gift.gt === 2) {
      if (gift.g > 10000 && gift.g <= 10070) {
        return giftList.enquete.find(item => item.gift_id === gift.g).image;
      } else {
        return giftList.normal.find(item => item.gift_id === gift.g).image;
      }
    } else {
      return giftList.normal.find(item => item.gift_id === gift.g).image;
    }
  },
  getRandomNum: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
  }
};

export default tools;