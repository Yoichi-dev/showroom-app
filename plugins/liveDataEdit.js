function comment(msgJson) {
  return {
    id: msgJson.u,
    name: msgJson.ac,
    cm: msgJson.cm,
    flg: msgJson.ua,
    av: msgJson.av,
  }
}

// コメント:true
// カウント:false
function commentCountCheck(msgJson) {
  // .があったら小数点の可能性有り
  if (msgJson.cm.includes('.')) {
    // コメント
    return true
  }
  // 全角数字を半角に変換
  const numberFormat = msgJson.cm.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  })
  if (
    !isNaN(numberFormat) &&
    Number(numberFormat) >= 0 &&
    Number(numberFormat) <= 50
  ) {
    // カウント
    return false
  } else {
    // コメント
    return true
  }
}

// 無料:true
// 有料:false
function giftCheck(msgJson) {
  // ギフトチェック
  if (msgJson.gt === 2) {
    // 投票
    if (Number(msgJson.g) > 10000 && Number(msgJson.g) <= 10070) {
      // 投票ボール
    } else if (msgJson.g === 1601) {
      // 虹星
      return false;
    } else if (
      msgJson.g === 1 ||
      msgJson.g === 1001 ||
      msgJson.g === 1002 ||
      msgJson.g === 1003 ||
      msgJson.g === 2 ||
      msgJson.g === 1501 ||
      msgJson.g === 1502 ||
      msgJson.g === 1503 ||
      msgJson.g === 1504 ||
      msgJson.g === 1505 ||
      msgJson.g === 3000421
    ) {
      // 無料
      return true;
    } else {
      // 星以外のフリーギフト
      return false;
    }
  } else {
    // 有料
    return false;
  }
}

function freeGift(msgJson) {
  return msgJson
}

function preGift(msgJson) {
  return msgJson
}

function count(msgJson) {
  // 全角数字を半角に変換
  const numberFormat = msgJson.cm.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  })
  return {
    id: msgJson.u,
    name: msgJson.ac,
    num: numberFormat,
    flg: msgJson.ua,
    av: msgJson.av,
  }
}

function info(msgJson) {
  if (msgJson.m.match(/さんがフォローしました！❤/)) {
    return {
      id: msgJson.u,
      name: '',
      cm: msgJson.m,
      flg: 'follow',
      av: '',
    }
  } else {
    return {
      id: msgJson.u,
      name: '',
      cm: msgJson.m,
      flg: msgJson.c,
      av: '',
    }
  }
}

export { comment, commentCountCheck, giftCheck, freeGift, preGift, count, info };