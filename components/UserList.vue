<template>
  <v-row justify="center" class="mt-5">
    <v-expansion-panels :mandatory="true" popout>
      <v-expansion-panel>
        <v-expansion-panel-header>参加者リスト</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="user in userList" :key="user.room_id">
                  <td>{{ user.room_name }}</td>
                  <td>
                    <v-btn
                      class="ma-2"
                      outlined
                      color="green"
                      :to="user.event_id + '/' + user.room_id"
                    >
                      個別分析
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
export default {
  props: ["userList"],
};
</script>