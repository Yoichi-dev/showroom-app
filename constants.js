const constants = {
  url: {
    live: {
      onlives: "https://pianistmusica.net/live/onlives",
      premium: "https://pianistmusica.net/live/premium",
      giftList: "https://pianistmusica.net/live/gift_list/",
      stageUserList: "https://pianistmusica.net/live/stage_user_list/",
      liveInfo: "https://pianistmusica.net/live/live_info/",
      commentLog: "https://pianistmusica.net/live/comment_log/",
      giftLog: "https://pianistmusica.net/live/gift_log/",
      summaryRanking: "https://pianistmusica.net/live/summary_ranking/",
    },
    room: {
      profile: "https://pianistmusica.net/room/profile/",
      eventAndSupport: "https://pianistmusica.net/room/event_and_support/",
      telop: "https://pianistmusica.net/other/telop/"
    },
    user: {
      profile: "https://pianistmusica.net/users/profile/",
    },
    event: {
      contributionRanking: "https://pianistmusica.net/events/contribution_ranking/"
    },
    other: {
      broadcast: "https://pianistmusica.net/other/broadcast",
      status: "https://pianistmusica.net/other/status",
      delete: "https://pianistmusica.net/other/delete",
      search: "https://pianistmusica.net/other/search?keyword=",
    },
    watchlog: {
      getloglist: "https://pianistmusica.net/watchlog/getloglist",
      addlog: "https://pianistmusica.net/watchlog/addlog",
      getlog: "https://pianistmusica.net/watchlog/getlog",
      corruption: "https://pianistmusica.net/watchlog/corruption",
      delete: "https://pianistmusica.net/watchlog/delete"
    },
    point: {
      event: "https://pianistmusica.net/pointhistory/check/"
    }
  },
  ws: "wss://online.showroom-live.com",
  bonusPoint: [1, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2],
  giftBonus: 2.5,
  developer: 3699368,
}

module.exports = Object.freeze(constants);