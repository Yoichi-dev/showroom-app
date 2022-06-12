const constants = {
  url: {
    main: "https://showroom-app-api.herokuapp.com",
    sub: "https://showroom-app-api.herokuapp.com",
    search: "other/search?keyword=",
    live: {
      onlives: "/live/onlives",
      premium: "/live/premium",
      giftList: "/live/gift_list/",
      stageUserList: "/live/stage_user_list/",
      liveInfo: "/live/live_info/",
      commentLog: "/live/comment_log/",
      giftLog: "/live/gift_log/",
    },
    room: {
      profile: "/room/profile/",
      eventAndSupport: "/room/event_and_support/",
    },
    user: {
      profile: "/users/profile/",
    },
    other: {
      broadcast: "/other/broadcast",
      delete: "/other/delete"
    }
  },
  ws: "wss://online.showroom-live.com",
  blockRoom: ['259669', '310995', '311596', '323072', '311391'],
  blockUsers: [3377243, 3640889, 4180180, 3840137, 2862557]
}

module.exports = Object.freeze(constants);