const constants = {
  url: {
    live: {
      onlives: "https://yoichiro-api-v1.site:61808/live/onlives",
      premium: "https://yoichiro-api-v1.site:61808/live/premium",
      giftList: "https://yoichiro-api-v1.site:61808/live/gift_list/",
      stageUserList: "https://yoichiro-api-v1.site:61808/live/stage_user_list/",
      liveInfo: "https://yoichiro-api-v1.site:61808/live/live_info/",
      commentLog: "https://yoichiro-api-v1.site:61808/live/comment_log/",
      giftLog: "https://yoichiro-api-v1.site:61808/live/gift_log/",
    },
    room: {
      profile: "https://yoichiro-api-v1.site:61808/room/profile/",
      eventAndSupport: "https://yoichiro-api-v1.site:61808/room/event_and_support/",
      telop: "http://localhost:3001/other/telop/"
    },
    user: {
      profile: "https://yoichiro-api-v1.site:61808/users/profile/",
    },
    other: {
      broadcast: "https://yoichiro-api-v1.site:61808/other/broadcast",
      status: "https://yoichiro-api-v1.site:61808/other/status",
      delete: "https://yoichiro-api-v1.site:61808/other/delete",
      search: "https://yoichiro-api-v1.site:61808/other/search?keyword=",
    },
    watchlog: {
      getloglist: "http://localhost:3001/watchlog/getloglist",
      addlog: "https://yoichiro-api-v1.site:61808/watchlog/addlog",
      getlog: "http://localhost:3001/watchlog/getlog",
      corruption: "http://localhost:3001/watchlog/corruption",
      delete: "http://localhost:3001/watchlog/delete"
    }
  },
  ws: "wss://online.showroom-live.com",
  bonusPoint: [1, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2],
  giftBonus: 2.5,
  developer: 3699368,
}

module.exports = Object.freeze(constants);