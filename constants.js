const constants = {
  url: {
    domain: "https://showroom-app-api.herokuapp.com",
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
    all: {
      event: "/pointhistory/event/",
      user: "/pointhistory/event/",
    }
  },
}

module.exports = Object.freeze(constants);