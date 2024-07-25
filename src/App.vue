<script setup lang="ts">
import type { Config } from 'node_modules/@aarc-dev/auth-widget-vuejs/dist/types'
import HelloWorld from './components/HelloWorld.vue'
import Aarc, { getMetaMaskProvider, EIP1193Provider } from '@aarc-dev/auth-widget-vuejs'
import { createWalletClient, custom } from 'viem'
import { mainnet, polygon } from 'viem/chains'

const aarcAuthStore = Aarc.useAarcAuthStore()

const showModal = aarcAuthStore.openModal
const closeModal = aarcAuthStore.closeModal

const prov = getMetaMaskProvider()
console.log('MetaMask Provider', prov)

const config: Config = {
  aarcApiKey: '294ffbcf-6a16-4e8a-8b5c-9aca09188f36', // Staging
  // 'xyz', // Prod
  appearance: {
    logoUrl:
      'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png',
    textColor: '#FFF',
    themeColor: '#2d2d2d'
  },
  env: 'staging',
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

console.log('Auth Client', aarcAuthStore.authClient)

const getSigner = async () => {
  // Get Signer
  console.log('Auth Client', aarcAuthStore.authClient)
  const signer = await aarcAuthStore?.authClient?.getSigner('https://polygon-rpc.com')
  console.log('Signer', signer)
  const walletAddress = await signer.getWalletAddress()
  console.log('Wallet Address', walletAddress)
}

const createCustomProvider = async () => {
  // Create Custom Provider
  const prov = new EIP1193Provider(aarcAuthStore.authClient, polygon.rpcUrls.default.http[0])

  console.log('Endpoint', polygon.rpcUrls.default.http[0])

  const client = createWalletClient({
    chain: polygon,
    transport: custom(prov)
  })

  console.log('Custom Provider', prov)
  console.log('Custom Client', await client.getAddresses())
  const account = await client.getAddresses()

  const smsg = await client.signMessage({
    message: 'Hello World',
    account: account[0]
  })

  console.log('Signed Message', smsg)

  // const hash = await aarcAuthStore?.authClient?.sendTransaction(
  //   '0xcC58afEE1A672fa7e7E5F7FE0DF9D259FFb7FadA',
  //   1000000n,
  //   'https://eth-sepolia.g.alchemy.com/v2/kAtzhIquoQvbmk8VJBP-knCxVhYVrFFD'
  // )
  // console.log('Transaction Hash', hash)
}

const metamaskInstance = async () => {
  const provider = getMetaMaskProvider()
  console.log('MetaMask Provider', provider)
  const client = createWalletClient({
    chain: mainnet,
    transport: custom(provider)
  })

  console.log('MetaMask Provider', provider)
  console.log('MetaMask Client', await client.getAddresses())
}

const signMessage = async () => {
  // Sign Message
  const messageTxt = 'Hello World'
  const signature = await aarcAuthStore?.authClient?.signMessage(
    'https://polygon-rpc.com',
    messageTxt
  )
  console.log('Signature', signature)
}

const signOut = async () => {
  // Sign Out
  await aarcAuthStore?.authClient?.signOut()
}
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
    <button @click="getSigner">Get Signer</button>
    <button @click="signMessage">Sign Message</button>
    <button @click="signOut">Sign Out</button>
    <button @click="createCustomProvider">Create Custom Provider</button>
    <button @click="metamaskInstance">MetaMask Instance</button>
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
