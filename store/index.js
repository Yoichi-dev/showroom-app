export const strict = false

export const state = () => ({
    roomid: null,
})

export const mutations = {
    setRoomid(state, id) {
        state.roomid = id
    },
}