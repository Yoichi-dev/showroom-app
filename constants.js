const constants = {
  url: {
    domain: "http://192.168.11.27:3001",
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