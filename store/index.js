export const strict = false

export const state = () => ({
    roomid: null,
    streaminglog: null,
})

export const mutations = {
    setRoomid(state, id) {
        state.roomid = id
    },
    setStreaminglog(state, log) {
        state.streaminglog = log
    },
}