<template>
  <div>
    <v-row justify="center" class="mt-10">
      <p class="mt-10 title text--primary">{{ title }}の時間別ポイント</p>
    </v-row>
    <v-row justify="center" class="mt-10">
      <Chart
        :chartData="pointChartData"
        :options="pointOptions"
        :styles="chartStyle"
      />
    </v-row>
    <v-row justify="center" class="mt-10">
      <p class="mt-10 title text--primary">{{ title }}の時間別フォロワー</p>
    </v-row>
    <v-row justify="center" class="mt-10">
      <Chart
        :chartData="followerChartData"
        :options="followerOptions"
        :styles="chartStyle"
      />
    </v-row>
    <v-row justify="center" class="mt-10">
      <p class="mt-10 title text--primary">{{ title }}の時間別順位</p>
    </v-row>
    <v-row justify="center" class="mt-10">
      <Chart
        :chartData="rankChartData"
        :options="rankOptions"
        :styles="chartStyle"
      />
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["pointChartData", "followerChartData", "rankChartData", "title"],
  data() {
    return {
      chartStyle: {
        height: "80vh",
        width: "100px",
        position: "relative",
      },
      pointOptions: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 1000,
        legend: {
          position: "top",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                userCallback: (value, index, values) =>
                  value.toLocaleString() + "pt",
              },
            },
          ],
        },
      },
      followerOptions: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 1000,
        legend: {
          position: "top",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                userCallback: (value, index, values) =>
                  value.toLocaleString() + "人",
                precision: 0,
              },
            },
          ],
        },
      },
      rankOptions: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 1000,
        legend: {
          position: "top",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                reverse: true,
                beginAtZero: true,
                userCallback: (value, index, values) => {
                  if (Math.floor(value) === value) {
                    return value.toLocaleString() + "位";
                  }
                },
              },
            },
          ],
        },
      },
    };
  },
  watch: {
    pointChartData: function (newData, oldData) {
      // スマホ
      if (this.$vuetify.breakpoint.name == "xs") {
        this.chartStyle.width = "100vw";
        if (newData.datasets.length <= 10) {
          // 10人以下
          this.chartStyle.height = "80vh";
        } else if (
          newData.datasets.length > 10 &&
          newData.datasets.length <= 15
        ) {
          // 15人以下
          this.chartStyle.height = "100vh";
        } else if (
          newData.datasets.length > 15 &&
          newData.datasets.length <= 25
        ) {
          // 25人以下
          this.chartStyle.height = "120vh";
        } else {
          // 25人以上
          this.chartStyle.height = "200vh";
        }
      }
      // iPad（タブレット）
      if (this.$vuetify.breakpoint.name == "sm") {
        this.chartStyle.width = "100vw";
        if (newData.datasets.length <= 15) {
          // 15人以下
          this.chartStyle.height = "80vh";
        } else if (
          newData.datasets.length > 15 &&
          newData.datasets.length <= 25
        ) {
          // 25人以下
          this.chartStyle.height = "100vh";
        } else {
          // 25人以上
          this.chartStyle.height = "150vh";
        }
      }
      // iPad Pro（タブレット大）
      if (this.$vuetify.breakpoint.name == "md") {
        this.chartStyle.width = "90vw";
        if (newData.datasets.length <= 25) {
          // 25人以下
          this.chartStyle.height = "80vh";
        } else {
          // 25人以上
          this.chartStyle.height = "100vh";
        }
      }
      // PC
      if (this.$vuetify.breakpoint.name == "lg") {
        this.chartStyle.width = "75vw";
        if (newData.datasets.length <= 25) {
          // 25人以下
          this.chartStyle.height = "75vh";
        } else {
          // 25人以上
          this.chartStyle.height = "100vh";
        }
      }
      // PC FullHD
      if (this.$vuetify.breakpoint.name == "xl") {
        this.chartStyle.width = "70vw";
        if (newData.datasets.length <= 25) {
          // 25人以下
          this.chartStyle.height = "80vh";
        } else {
          // 25人以上
          this.chartStyle.height = "100vh";
        }
      }
    },
  },
};
</script>