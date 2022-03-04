export const strict = false

export const state = () => ({
    roomid: null,
    url: null,
    streaminglog: null,
})

export const mutations = {
    setRoomid(state, id) {
        state.roomid = id
    },
    setUrl(state, url) {
        state.url = url
    },
    setStreaminglog(state, log) {
        state.streaminglog = log
    },
}