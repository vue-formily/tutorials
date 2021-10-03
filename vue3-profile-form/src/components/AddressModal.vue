<template>
  <div class="fixed flex justify-center items-center w-full h-full top-0 left-0">
    <div
      class="bg-black absolute w-full h-full opacity-30"
      @click="close"
    ></div>

    <form class="bg-white shadow p-5 z-10 rounded w-full max-w-screen-sm">
      <h2 class="border-b border-gray-300 pb-2 mb-5 font-bold">
        {{ address ? 'Edit Address' : 'New Address' }}
      </h2>

      <div v-for="(field, i) in forms.address.fields" :key="i" class="mt-1">
        <label class="mb-2 inline-block font-bold text-sm" :for="field._uid">
          {{ field.props.label }}
        </label>

        <input
          v-model="field.raw"
          :type="field.props.inputType || 'text'"
          :name="field.htmlName"
          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm"
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
      <div class="flex justify-center">
        <button
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-8 mr-2"
          @click="close"
        >
          Cancel
        </button>
        <button
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-8"
          @click.prevent="submit"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { defineSchema, FormInstance } from '@vue-formily/formily';

export const addressSchema = defineSchema({
  formId: 'address',
  fields: [
    {
      formId: 'address',
      props: {
        label: 'Address'
      },
    },
    {
      formId: 'city',
      props: {
        label: 'City'
      }
    },
    {
      formId: 'postcode',
      type: 'number',
      props: {
        inputType: 'number',
        label: 'Postcode'
      }
    }
  ]
});

export type AddressForm = FormInstance<typeof addressSchema>;

export default defineComponent({
  name: 'AddressModal',
  props: {
    address: Object as PropType<AddressForm>,
  },
  created() {
    this.$formily.addForm(addressSchema);

    if (this.address) {
      this.forms.address.setValue(this.address.value);
    }
  },
  unmounted() {
    this.$formily.removeForm('address');
  },
  methods: {
    submit() {
      const addressForm = this.$formily.getForm<AddressForm>('address');

      this.$emit('save', addressForm.value, this.address);
    },
    close() {
      this.$emit("close");
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
