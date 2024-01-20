import axios from '../axios/axios';
import showroomConfig from '~/config/showroom.config';

const apis = {
  giftList: async (roomId) => {
    const result = await axios
      .post(showroomConfig.api, {
        category: 'live',
        type: 'gift_list',
        key: roomId,
      })
      .then((res) => {
        const { data } = res;
        return data;
      })
      .catch((e) => {
        return null;
      });
    return result;
  },
  status: async (roomUrlKey) => {
    const result = await axios
      .post(showroomConfig.api, {
        category: 'room',
        type: 'status',
        key: roomUrlKey,
      })
      .then((res) => {
        const { data } = res;
        if ('errors' in data) {
          if ('redirect_url' in data.errors[0]) {
            return {
              live_type: 1
            };
          }
        } else {
          return {
            live_type: 0,
            data
          };
        }
      })
      .catch((e) => {
        return {
          live_type: 9
        };
      });
    return result;
  },
  getCommentLog: async (roomId) => {
    const result = await axios
      .post(showroomConfig.api, {
        category: 'live',
        type: 'comment_log',
        key: roomId,
      })
      .then((res) => {
        const { data } = res;
        return data;
      })
      .catch((e) => {
        return null;
      });
    return result;
  },
  getGiftLog: async (roomId) => {
    const result = await axios
      .post(showroomConfig.api, {
        category: 'live',
        type: 'gift_log',
        key: roomId,
      })
      .then((res) => {
        const { data } = res;
        return data;
      })
      .catch((e) => {
        return null;
      });
    return result;
  },
  getStageUserList: async (roomId) => {
    const result = await axios
      .post(showroomConfig.api, {
        category: 'live',
        type: 'stage_user_list',
        key: roomId,
      })
      .then((res) => {
        const { data } = res;
        return data;
      })
      .catch((e) => {
        return null;
      });
    return result;
  },
};

export default apis;