<template>
  <div>
    <v-container style="max-width: 786px">
      <portal to="streamTitleBar">
        <div>
          <v-icon small class="mr-2 hidden-xs-only">mdi-information</v-icon>
          <span class="space-grotest">Information</span>
        </div>
      </portal>

      <!-- show loading if fetching-->
      <v-progress-linear
        v-if="!stream"
        indeterminate
        color="primary"
        class="mb-0"
        style="position: absolute; top: 0; left: 0; right: 0; z-index: 1"
      ></v-progress-linear>

      <!-- display all the streams in streamsByIds array in a column -->
      <div v-if="stream.isBatch">
        <v-card class="mb-3">
          <v-card-title>
            <span class="headline">{{ stream.name }}</span>
          </v-card-title>
          <v-card-text>
            <!-- list of 2 items -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  v-text="stream.nestingEfficiency ? stream.nestingEfficiency : 'not calculated'"
                >
                  {{ stream.nestingEfficiency }}
                </v-list-item-title>
                <v-list-item-subtitle>Nesting Efficiency</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  v-text="stream.nestingEfficiency ? stream.nestingEfficiency : 'not calculated'"
                ></v-list-item-title>
                <v-list-item-subtitle>Number Of Boards</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  {{ stream.projectIds.length }}
                </v-list-item-title>
                <v-list-item-subtitle>Total Projects</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-actions>
              <v-btn outlined :color="`${$vuetify.theme.dark ? 'primary' : 'primary'}`">
                calculate
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
        <div v-for="(stream, index) in streamsByIds.items" :key="index">
          <v-card
            elavation="1"
            rounded="lg"
            class="mb-3"
            :class="`${!$vuetify.theme.dark ? 'grey lighten-5' : ''}`"
          >
            <v-toolbar flat :class="`${!$vuetify.theme.dark ? 'white' : ''} mb-2`">
              <v-toolbar-title>
                <span class="d-inline-block">{{ stream.name }}</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-chip class="ma-4" color="orange" outlined>
                  <v-icon left>mdi-list-status</v-icon>
                  {{ stream.status }}
                </v-chip>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <!-- display all the project details -->
              <v-card-text>
                <div>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt exercitationem
                  ex quis? Pariatur earum voluptas non, sequi iste porro dolorem?
                  {{ stream.description }}
                </div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <!-- <v-card-title>other Info</v-card-title> -->

              <v-card-text>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ stream.materialType }}</v-list-item-title>

                    <v-list-item-subtitle>Material Type</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ stream.materialThickness ? stream.materialThickness : '10.0' }}
                    </v-list-item-title>

                    <v-list-item-subtitle>Material Thickness</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="`${stream.paid ? 'paid' : 'free'}`"
                    ></v-list-item-title>

                    <v-list-item-subtitle>Payment</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ stream.areaOfAllPartsTogether }}</v-list-item-title>

                    <v-list-item-subtitle>Area Of All Parts Together</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-card-text>

              <v-card-actions>
                <v-btn color="deep-purple lighten-2" text @click="reserve">Project</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <v-card
        v-if="!stream.isBatch"
        elavation="1"
        rounded="lg"
        :class="`${!$vuetify.theme.dark ? 'grey lighten-5' : ''}`"
      >
        <v-toolbar flat :class="`${!$vuetify.theme.dark ? 'white' : ''} mb-2`">
          <v-toolbar-title>
            <span class="d-inline-block">{{ stream.name }}</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-chip class="ma-4" color="orange" outlined>
              <v-icon left>mdi-list-status</v-icon>
              {{ stream.status }}
            </v-chip>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <!-- display all the project details -->
          <v-card-text>
            <div>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt exercitationem ex
              quis? Pariatur earum voluptas non, sequi iste porro dolorem?
              {{ stream.description }}
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <!-- <v-card-title>other Info</v-card-title> -->

          <v-card-text>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ stream.materialType }}</v-list-item-title>

                <v-list-item-subtitle>Material Type</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  {{ stream.materialThickness ? stream.materialThickness : '10.0' }}
                </v-list-item-title>

                <v-list-item-subtitle>Material Thickness</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="`${stream.paid ? 'paid' : 'free'}`"></v-list-item-title>

                <v-list-item-subtitle>Payment</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ stream.areaOfAllPartsTogether }}</v-list-item-title>

                <v-list-item-subtitle>Area Of All Parts Together</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-card-text>

          <v-card-actions>
            <v-btn color="deep-purple lighten-2" text @click="reserve">Project</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'StreamInfo',
  apollo: {
    stream: {
      // prefetch: true,
      query: gql`
        query Stream($id: String!) {
          stream(id: $id) {
            id
            isPublic
            name
            description
            paid
            materialType
            materialThickness
            status
            tools
            areaOfAllPartsTogether
            isBatch
            projectIds
            nestingEfficiency
            numberOfBoards
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.streamId
        }
      },
      error(err) {
        if (err.message) this.error = err.message.replace('GraphQL error: ', '')
        else this.error = err
      }
    },
    streamsByIds: {
      query: gql`
        query streamsByIds($ids: [String]!) {
          streamsByIds(streamIds: $ids) {
            items {
              id
              name
              description
              paid
              materialType
              materialThickness
              status
              tools
              areaOfAllPartsTogether
              isBatch
            }
          }
        }
      `,
      variables() {
        return {
          ids: this.stream.projectIds
        }
      },
      skip() {
        return !this.stream.projectIds
      },
      error(err) {
        if (err.message) this.error = err.message.replace('GraphQL error: ', '')
        else this.error = err
      }
    },
    $subscribe: {
      streamUpdated: {
        query: gql`
          subscription ($streamId: String!) {
            streamUpdated(streamId: $streamId)
          }
        `,
        variables() {
          return {
            streamId: this.$route.params.streamId
          }
        },
        result() {
          this.$apollo.queries.stream.refetch()
        },
        skip() {
          return !this.loggedIn
        }
      }
    },
    mounted() {
      this.$apollo.queries.stream.refetch()
    },
    data: () => ({
      stream: null
    })
  }
}
</script>