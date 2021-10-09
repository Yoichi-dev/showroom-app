<template>
  <main>
    <section class="min-vh-100 d-flex bg-primary align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 justify-content-center">
            <div class="card bg-primary shadow-soft border-light p-4">
              <div class="card-header text-center pb-0">
                <h2 class="mb-0 h5">Minecraft Server 利用申請</h2>
                <h2 class="mb-0 h6">Java版</h2>
              </div>
              <div class="card-body">
                <div
                  class="
                    d-block d-sm-flex
                    justify-content-center
                    align-items-center
                  "
                >
                  <span class="font-weight-normal">
                    本サーバーはホワイトリスト方式です。事前にホワイトリストに登録する必要があるのでこちらより申請してください。（申請後約30分前後で接続できるようになります）
                  </span>
                </div>
                <div class="row justify-content-center mt-5">
                  <div class="col-12">
                    <div
                      class="
                        alert alert-info alert-dismissible
                        shadow-soft
                        fade
                        show
                      "
                      role="alert"
                    >
                      <span class="alert-inner--icon"
                        ><span class="fas fa-server"></span
                      ></span>
                      <span class="alert-inner--text">
                        {{ ip }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="form-group">
                    <label for="minecraftId">Minecraft ID</label>
                    <div class="input-group mb-4">
                      <div class="input-group-prepend">
                        <span class="input-group-text"
                          ><span class="fab fa-medium-m"></span
                        ></span>
                      </div>
                      <input
                        class="form-control"
                        id="minecraftId"
                        placeholder="TYoichiro"
                        type="text"
                        aria-label="email adress"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="twitterId">Twitter ID (連絡用)</label>
                    <div class="input-group mb-4">
                      <div class="input-group-prepend">
                        <span class="input-group-text"
                          ><span class="fab fa-twitter"></span
                        ></span>
                      </div>
                      <input
                        class="form-control"
                        id="twitterId"
                        placeholder="@TYoichiro"
                        type="text"
                        aria-label="email adress"
                      />
                    </div>
                  </div>
                  <button class="btn btn-block btn-primary" @click="search()">
                    申請
                  </button>
                </div>
                <div class="mt-4 text-center">
                  <span class="font-weight-normal">お問合せ</span>
                </div>
                <div class="btn-wrapper my-4 text-center">
                  <button
                    class="btn btn-primary btn-icon-only text-twitter mr-2"
                    type="button"
                    aria-label="twitter button"
                    title="twitter button"
                    @click="twitter()"
                  >
                    <span aria-hidden="true" class="fab fa-twitter"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      ip: "",
    };
  },
  mounted() {
    this.ip = process.env.MINECRAFT_SERVER;
  },
  methods: {
    search() {
      let minecraftId = document.getElementById("minecraftId").value;
      if (minecraftId == "") {
        alert("Minecraft IDを入力してください");
        return;
      }
      let twitterId = document.getElementById("twitterId").value;
      if (twitterId == "") {
        alert("Twitter IDを入力してください");
        return;
      }
      axios
        .get(
          `${process.env.API_URL}/api/minecraft/search/${minecraftId}/${twitterId}`
        )
        .then((response) => {
          if (response.status != 404) {
            alert("登録完了しました\n約30分前後で接続できるようになります");
          }
        })
        .catch((err) => {
          alert("入力されたMinecraft IDは存在しません");
        });
    },
    twitter() {
      window.open("https://twitter.com/TYoichiro", "_blank");
    },
  },
};
</script>
