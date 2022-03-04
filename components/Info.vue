<template>
  <div>
    <div class="uk-card uk-card-default">
      <div class="uk-card-header uk-padding-small">
        <div class="uk-grid-small uk-flex-middle" uk-grid>
          <div class="uk-width-expand">
            <p
              class="uk-text-meta uk-margin-remove-top uk-margin-remove-bottom"
            >
              {{ info.title }}
            </p>
            <h3
              class="uk-card-title uk-margin-remove-top uk-margin-remove-bottom"
            >
              {{ info.main }}
            </h3>
            <small>{{ info.sub }}</small>
          </div>
          <div class="uk-width-auto">
            <span
              class="uk-margin-small-right"
              width="40"
              height="40"
              :uk-icon="info.icon"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoConponent',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
}
</script>
