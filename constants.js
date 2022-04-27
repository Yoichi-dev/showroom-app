const constants = {
  url: {
    domain: "https://yoichiro-api-v1.site:61808",
    event: {
      hold: "/events/hold",
      end: "/events/end",
      info: "/events/info/",
      users: "/events/users/",
    },
    history: {
      search: "/history/",
      aggregate: "/history/aggregate/",
    },
    room: {
      profile: "/room/profile/",
    },
  },
}

module.exports = Object.freeze(constants);