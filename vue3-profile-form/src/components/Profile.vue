<template>
  <div class="mx-12 flex justify-center h-screen flex-col text-left">
    <a href="https://vue-formily.netlify.app/" target="_blank"
      ><img class="mb-6 ml-4" src="../assets/logo-light.svg" width="100"
    /></a>

    <div class="shadow-lg p-6 bg-white rounded">
      <h1 class="text-3xl text-thin mb-6">Your Account</h1>

      <form class="">
        <div v-for="(field, i) in forms.profile.fields" :key="i" class="mt-1">
          <label class="mb-2 inline-block" :for="field._uid">
            {{ field.props.label }}
          </label>

          <div v-if="field.formType === 'field'">
            <input
              v-model="field.raw"
              type="text"
              :name="field.htmlName"
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2 py-3 sm:text-sm border border-gray-300 rounded-md shadow-sm"
              autocomplete="off"
            />
            <div class="h-5 text-red-500 text-sm">
              <transition name="slide-fade">
                <div v-if="field.error">
                  {{ field.error }}
                </div>
              </transition>
            </div>
          </div>
          <div v-else-if="field.formType === 'collection'">
            <button
              class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-5"
              @click.prevent="showAddressForm"
            >
              New Address
            </button>
            <div class="flex flex-wrap">
              <template v-for="group in field.groups" :key="group.index">
                <div class="pr-2 mb-2 w-1/2 relative">
                  <div
                    v-if="group.address.value"
                    class="bg-gray-200 p-3 rounded text-sm"
                  >
                    <b>Address:</b> {{ group.address.value }} <br />
                    <b>City:</b> {{ group.city.value }} <br />
                    <b>Postcode:</b> {{ group.postcode.value }}
                  </div>

                  <button class="text-md absolute top-0 right-7 p-1 hover:text-blue-500" @click.prevent="editAddress(group)">✎</button>
                  <button class="text-md absolute top-0 right-3 p-1 hover:text-blue-500" @click.prevent="removeAddress(group)">x</button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <button
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-8"
          @click="submit"
        >
          Save
        </button>
      </form>

      <AddressModal @close="showModal = false" :address="currentAddress" @save="saveAddress" v-if="showModal" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CollectionItemInstance, defineSchema, FormInstance } from '@vue-formily/formily';
import AddressModal, { addressSchema } from './AddressModal.vue';

const profileSchema = defineSchema({
  formId: 'profile',
  fields: [
    {
      formId: 'name',
      value: 'Adam',
      props: {
        label: 'Name'
      }
    },
    {
      formId: 'addresses',
      props: {
        label: 'Addresses'
      },
      group: addressSchema
    }
  ]
});

type ProfileForm = FormInstance<typeof profileSchema>;
type AddressItem = CollectionItemInstance<ProfileForm['addresses']>;

export default defineComponent({
  name: 'Login',
  components: {
    AddressModal
  },
  data() {
    return {
      showModal: false,
      currentAddress: null as AddressItem | null,
    };
  },
  created() {
    this.$formily.addForm(profileSchema);

    // Init addresses
    this.forms.profile.addresses.setValue([
      {
        address: '9/52-56 Gladesville Rd',
        city: 'Hunters Hill',
        postcode: '2110',
      },
    ]);
  },
  methods: {
    showAddressForm() {
      this.showModal = true;
    },
    hideAddressForm() {
      this.showModal = false;
    },
    async saveAddress(newAddress: Record<string, any>, editingAddress: AddressItem) {
      const profile = this.$formily.getForm<ProfileForm>('profile');

      if (editingAddress) {
        editingAddress.setValue(newAddress);
      } else {
        await profile.addresses.addGroup().setValue(newAddress);
      }

      this.hideAddressForm();
    },
    async editAddress(address: AddressItem) {
      this.currentAddress = address;
      
      this.showAddressForm();
    },
    removeAddress(group: AddressItem) {
      const profile = this.$formily.getForm<ProfileForm>('profile');

      profile.addresses.removeGroup(group);
    },
    async submit(e: Event) {
      e.preventDefault();

      this.forms.profile.shake();
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
