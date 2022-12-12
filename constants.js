const constants = {
  url: {
    showroom_api: "/showroom/api",
    pointhistory_api: "/pointhistory/check",
    search: "/showroom/search?keyword=",
    watchlog: {
      getloglist: "/watchlog/getloglist",
      addlog: "/watchlog/addlog",
      getlog: "/watchlog/getlog",
      corruption: "/watchlog/corruption",
      delete: "/watchlog/delete"
    },
    point: {
      event: "/pointhistory/check/"
    }
  },
  ws: "wss://online.showroom-live.com",
  bonusPoint: [1, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2],
  giftBonus: 2.5,
  developer: 3699368,
}

module.exports = Object.freeze(constants);