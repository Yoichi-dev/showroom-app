const constants = {
  url: {
    live: {
      onlives: "https://api.showroom-app.com/live/onlives",
      premium: "https://api.showroom-app.com/live/premium",
      giftList: "https://api.showroom-app.com/live/gift_list/",
      stageUserList: "https://api.showroom-app.com/live/stage_user_list/",
      liveInfo: "https://api.showroom-app.com/live/live_info/",
      commentLog: "https://api.showroom-app.com/live/comment_log/",
      giftLog: "https://api.showroom-app.com/live/gift_log/",
    },
    room: {
      profile: "https://api.showroom-app.com/room/profile/",
      eventAndSupport: "https://api.showroom-app.com/room/event_and_support/",
      telop: "https://api.showroom-app.com/other/telop/"
    },
    user: {
      profile: "https://api.showroom-app.com/users/profile/",
    },
    other: {
      broadcast: "https://api.showroom-app.com/other/broadcast",
      status: "https://api.showroom-app.com/other/status",
      delete: "https://api.showroom-app.com/other/delete",
      search: "https://api.showroom-app.com/other/search?keyword=",
    },
    watchlog: {
      getloglist: "https://api.showroom-app.com/watchlog/getloglist",
      addlog: "https://api.showroom-app.com/watchlog/addlog",
      getlog: "https://api.showroom-app.com/watchlog/getlog",
      corruption: "https://api.showroom-app.com/watchlog/corruption",
      delete: "https://api.showroom-app.com/watchlog/delete"
    },
    point: {
      event: "https://api.showroom-app.com/pointhistory/check/"
    }
  },
  ws: "wss://online.showroom-live.com",
  bonusPoint: [1, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2],
  giftBonus: 2.5,
  developer: 3699368,
}

module.exports = Object.freeze(constants);