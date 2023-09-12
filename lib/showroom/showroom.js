import events from 'events';

/**
 * SHOWROOMライブチャット取得
 */
class Showroom extends events.EventEmitter {

  constructor(key, ws) {
    super();

    this.key = key;
    this.ws = ws;

    this.socket = null;
    this.ping = null;
  }

  connect() {

    if (this.socket || this.ping) {
      return;
    };

    this.socket = new WebSocket(this.ws);

    this.socket.onopen = (e) => {
      this.socket.send(`SUB\t${this.key}`);
      this.emit("onopen", e);
    };

    this.ping = setInterval(() => {
      this.socket.send('PING\tshowroom');
    }, 60000);

    this.socket.onerror = (e) => {
      this.disconnect();
      this.emit("error", e);
    };

    this.socket.onmessage = (message) => {
      const { data } = message;

      if (data === 'ACK\tshowroom' || data === 'Could not decode a text frame as UTF-8.') {
        return;
      }

      if (data === 'ERR') {
        this.disconnect();
        this.emit("error", data);
      }

      this.#messageCheck(data);
    }

  }

  disconnect() {
    if (this.socket !== null) {
      this.socket.close();
      clearInterval(this.ping);
    }
    this.socket = null;
    this.ping = null;
  }

  #messageCheck(message) {
    const msgJson = JSON.parse(message.split(`MSG\t${this.key}`)[1]);
    switch (Number(msgJson.t)) {
      case 1:
        this.#commentCountCheck(msgJson) ? this.emit("comment", msgJson) : this.emit("count", msgJson);
        break
      case 2:
        this.#giftCheck(msgJson);
        break
      case 8:
        this.emit("telop", msgJson.telop);
        break
      case 101:
        this.emit("end", msgJson);
        break
      case 104:
        this.emit("start", msgJson);
        break
      default:
      // console.log(msgJson);
    }
  }

  #giftCheck(msgJson) {
    const free = [1, 1001, 1002, 1003, 2, 1501, 1502, 1503, 1504, 1505, 3000421];

    if (msgJson.gt === 2) {
      if (msgJson.g > 10000 && msgJson.g <= 10070) {
        // 投票
        this.emit("enquete", msgJson);
      } else if (msgJson.g === 1601) {
        // 虹星
        this.emit("paid", msgJson);
      } else if (free.includes(msgJson.g)) {
        // 無料
        this.emit("free", msgJson);
      } else {
        // チャレンジギフト
        this.emit("paid", msgJson);
      }
    } else {
      // 有料
      this.emit("paid", msgJson);
    }
  }

  #commentCountCheck(msgJson) {
    if (msgJson.cm.includes('.')) {
      return true;
    }
    const numberFormat = msgJson.cm.replace(/[０-９]/g, (s) => {
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
  }

}

export default Showroom;