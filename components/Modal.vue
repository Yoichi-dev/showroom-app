<template>
  <div style="display: none">
    <div id="profile" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical" uk-overflow-auto>
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
              <img width="40" height="40" :src="modal.avatar_url" />
            </div>
            <div class="uk-width-expand">
              <h3 class="uk-card-title uk-margin-remove-bottom">
                {{ modal.name }}
              </h3>
              <p class="uk-text-meta uk-margin-remove-top">
                <small>リスナーレベル{{ modal.fan_level }}</small>
              </p>
            </div>
          </div>
        </div>
        <div class="uk-modal-body">
          <div class="uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
            <div class="uk-card-media-left uk-cover-container">
              <img :src="modal.image" width="600" height="400" alt="" />
            </div>
            <div>
              <div
                v-if="modal.description != undefined"
                class="uk-card-body"
                style="word-break: normal"
              >
                <div v-if="modal.account_id != adminId">
                  <button
                    v-if="!showFlg"
                    class="uk-button uk-button-danger"
                    @click="addBlock(modal.account_id)"
                  >
                    ブロック
                  </button>
                  <button
                    v-if="showFlg"
                    class="uk-button uk-button-default"
                    @click="delBlock(modal.account_id)"
                  >
                    ブロック解除
                  </button>
                </div>
                <div v-else>開発者をブロックすることできません</div>
                <hr />
                <h3 v-if="modal.account_id === adminId" class="uk-card-title">
                  WatchLogの開発中です
                </h3>
                <p
                  v-for="(text, index) in modal.description.split('\n')"
                  :key="index"
                >
                  {{ text }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-modal-footer uk-text-right">
          <a
            v-if="modal.sns_list != null"
            :href="modal.sns_list[0].url"
            style="float: left"
            target="_blank"
          >
            <img :src="modal.sns_list[0].icon" width="40" height="40" />
          </a>
          <button
            v-if="modal.room_profile != null"
            class="uk-button uk-button-primary"
            uk-toggle="target: #streamer"
            type="button"
          >
            配信者情報
          </button>
          <button
            class="uk-button uk-button-default uk-modal-close"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    <div id="streamer" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical" uk-overflow-auto>
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-expand">
              <h3 class="uk-card-title uk-margin-remove-bottom">
                {{
                  modal.room_profile != null ? modal.room_profile.main_name : ''
                }}
              </h3>
              <p class="uk-text-meta uk-margin-remove-top">
                <small>
                  フォロワー{{
                    modal.room_profile != null
                      ? modal.room_profile.follower_num
                      : ''
                  }}人
                </small>
              </p>
            </div>
          </div>
        </div>
        <div class="uk-modal-body">
          <div class="uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
            <div class="uk-card-media-left uk-cover-container">
              <img
                :src="
                  modal.room_profile != null ? modal.room_profile.image : ''
                "
                alt=""
              />
            </div>
            <div>
              <div
                v-if="
                  modal.room_profile != null
                    ? modal.room_profile.description != undefined
                    : ''
                "
                class="uk-card-body"
                style="word-break: break-all"
              >
                <h3
                  v-if="
                    modal.room_profile != null
                      ? modal.room_profile.is_onlive
                      : ''
                  "
                  class="uk-card-title uk-text-danger"
                >
                  現在配信中
                </h3>
                <div>
                  <a
                    class="uk-button uk-button-primary uk-margin-bottom"
                    :href="
                      modal.room_profile != null
                        ? modal.room_profile.share_url_live
                        : ''
                    "
                    target="_blank"
                  >
                    配信ルーム
                  </a>
                  <a
                    class="uk-button uk-button-primary uk-margin-bottom"
                    :href="
                      modal.room_profile != null
                        ? modal.room_profile.share_url
                        : ''
                    "
                    target="_blank"
                  >
                    プロフィール
                  </a>
                </div>
                <hr />
                <div
                  v-for="(text, index) in modal.room_profile != null
                    ? modal.room_profile.description.split('\n')
                    : ''"
                  :key="index"
                >
                  {{ text }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-modal-footer uk-text-right">
          <a
            v-if="
              modal.room_profile != null
                ? modal.room_profile.sns_list != null
                  ? true
                  : false
                : false
            "
            :href="modal.room_profile.sns_list[0].url"
            style="float: left"
            target="_blank"
          >
            <img
              :src="modal.room_profile.sns_list[0].icon"
              width="40"
              height="40"
            />
          </a>
          <button
            class="uk-button uk-button-primary"
            uk-toggle="target: #profile"
            type="button"
          >
            リスナー情報
          </button>
          <button
            class="uk-button uk-button-default uk-modal-close"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalConponent',
  props: {
    modal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      adminId: '3699368',
      showFlg: true,
    }
  },
  watch: {
    modal(value) {
      this.showFlg = value.block
    },
  },
  methods: {
    addBlock(id) {
      this.showFlg = true
      this.$emit('addBlock', id)
    },
    delBlock(id) {
      this.showFlg = false
      this.$emit('delBlock', id)
    },
  },
}
</script>
