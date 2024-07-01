<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import Aarc from '@aarc-dev/auth-widget-vuejs'

const aarcAuthStore = Aarc.Store.useAarcAuthStore()
const showModal = aarcAuthStore.openModal
const closeModal = aarcAuthStore.closeModal

const config: Store.Config = {
  aarcApiKey: 'b776f4d7-5df5-4e8c-a128-058bbe3eaace',
  appearance: {
    logoUrl:
      'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png',
    textColor: '#FFF',
    themeColor: '#2d2d2d'
  },
  env: 'prod',
  chainId: 11155111,
  callbacks: {
    onSuccess: function (data?: any): void {},
    onError: function (data?: any): void {},
    onClose: function (): void {},
    onOpen: function (): void {}
  },
  authMethods: ['email', 'sms', 'wallet'],
  socialAuth: ['google', 'discord']
}

aarcAuthStore.setConfig(config)
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld
        :msg="
          aarcAuthStore.isConnected
            ? `You are successfully connected!`
            : `Fund Kit Demo with Vue.js`
        "
      />
    </div>
    <button @click="showModal">Open Modal</button>
  </header>

  <main>
    <!-- <TheWelcome /> -->
    <AarcAuthProvider :config="config" :open="aarcAuthStore.isModalOpen" :on-close="closeModal" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
