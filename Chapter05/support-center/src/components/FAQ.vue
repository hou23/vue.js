<template>
  <main class="faq">
    <h1>Frenquently Asked Questions</h1>

    <div class="error" v-if="error">
      Can't load the questions
    </div>

    <section class="list">
      <article v-for="question of questions">
        <h2 v-html="question.title"></h2>
        <p v-html="question.content"></p>
      </article>
    </section>

    <Loading v-if="loading"></Loading>
  </main>
</template>

<script>
  import RemoteData from '../mixin/RemoteData'

  export default {
    mixins: [
      RemoteData({
        questionList: 'questions'
      })
    ],
    name: "FAQ",
    data() {
      return {
        questions: [],
        error: null,
        loading: false,
        remoteDataLoading: 42,
      }
    },
    async created() {
      this.loading = true
      try {
        this.questions = await this.$fetch('questions')
      } catch (e) {
        this.error = e
      }
      this.loading = false
    },
  }
</script>

<style scoped>

</style>
