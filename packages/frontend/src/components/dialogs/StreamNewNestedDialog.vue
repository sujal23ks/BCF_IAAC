<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-app-bar-nav-icon style="pointer-events: none">
        <v-icon>mdi-plus-box</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>Create a New Batch</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-form ref="form" v-model="valid" lazy-validation class="px-2" @submit.prevent="createBatch">
      <v-card-text>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          validate-on-blur
          autofocus
          label="Batch Name"
        />

      <v-list rounded >
      
      <v-list-item-group
        color="primary"
      >
        <v-list-item
          v-for="(stream) in streams.items"
          :key="stream.name"
        >
          
          <v-list-item-content>
            <v-list-item-title v-text="stream.name"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
          <v-checkbox @click="handleCheck(stream.id)"></v-checkbox>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>

        
        
        
        
        
      </v-card-text>
      <v-card-actions class="pb-3">
        <v-btn
          color="primary"
          block
          large
          :disabled="!valid"
          :loading="isLoading"
          elevation="0"
          type="submit"
        >
          Create Batch
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import gql from 'graphql-tag'
import userSearchQuery from '../../graphql/userSearch.gql'
import streamsQuery from '../../graphql/streams.gql'
import UserAvatar from '../UserAvatar'

export default {
  components: { UserAvatar },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    redirect: {
      type: Boolean,
      default: true
    }
  },
  apollo: {
    streams: {
      query: streamsQuery,
      fetchPolicy: 'cache-and-network' //https://www.apollographql.com/docs/react/data/queries/
    },
    userSearch: {
      query: userSearchQuery,
      variables() {
        return {
          query: this.search,
          limit: 10
        }
      },
      skip() {
        return !this.search || this.search.length < 3
      },
      debounce: 300
    }
  },
  data() {
    return {
      name: null,
      nestedStreams:{},
      description: null,
      orderId: null,
      deadline:null,
      valid: false,
      search: null,
      nameRules: [],
      isPublic: false,
      collabs: [],
      isLoading: false,
      
    }
  },
  watch: {
    open() {
      this.name = null
      this.search = null
      if (this.userSearch) this.userSearch.items = null
      this.collabs = []
    }
  },
  mounted() {
    this.nameRules = [
      (v) =>
        !v ||
        (v.length <= 150 && v.length >= 3) ||
        'Stream name must be between 3 and 150 characters.'
      // (v) => (!v && v.length <= 150) || 'Name must be less than 150 characters',
      // (v) => (!v && v.length >= 3) || 'Name must be at least 3 characters'
    ]
  },
  methods: {
    addCollab(user) {
      if (user.id === localStorage.getItem('uuid')) return
      let indx = this.collabs.findIndex((u) => u.id === user.id)
      if (indx !== -1) return
      user.role = 'stream:contributor'
      this.collabs.push(user)
      this.search = null
      this.userSearch.items = null
    },
    removeCollab(user) {
      let indx = this.collabs.findIndex((u) => u.id === user.id)
      this.collabs.splice(indx, 1)
    },
    handleCheck(id){
      
      if(this.nestedStreams[id]){
        delete this.nestedStreams[id]
      }else{
        this.nestedStreams[id] = true
      }
      console.log(this.nestedStreams)
    },
    async createBatch() {
      if (!this.$refs.form.validate()) return

      this.isLoading = true
      //this.$matomo && this.$matomo.trackPageView('stream/create')
      try {
        const steamsArr = Object.keys(this.nestedStreams)
        const payload = {
          name: this.name,
          streams: steamsArr
        }
        console.log(payload)
        /* let res = await this.$apollo.mutate({
          mutation: gql`
            mutation streamCreate($myStream: StreamCreateInput!) {
              streamCreate(stream: $myStream)
            }
          `,
          variables: {
            myStream: {
              name: this.name,
              isPublic: this.isPublic,
              description: this.description,
              orderId: this.orderId,
              //deadline:this.deadline
            }
          }
        }) */

        /* console.log(res)

        if (this.collabs.length !== 0) {
          for (let user of this.collabs) {
            await this.$apollo.mutate({
              mutation: gql`
                mutation grantPermission($params: StreamGrantPermissionInput!) {
                  streamGrantPermission(permissionParams: $params)
                }
              `,
              variables: {
                params: {
                  streamId: res.data.streamCreate,
                  userId: user.id,
                  role: 'stream:contributor'
                }
              }
            })
          }
        }
        this.$emit('created')
        if (this.redirect) this.$router.push({ path: `/streams/${res.data.streamCreate}` }) */
      } catch (e) {
        console.log(e)
      }
      this.isLoading = false
    }
  }
}
</script>
