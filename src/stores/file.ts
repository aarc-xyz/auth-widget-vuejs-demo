import { AuthSDK } from '@aarc-dev/auth-sdk'
import { EventEmitter } from 'events'

class EIP1193Provider extends EventEmitter {
  private authSDK: AuthSDK
  private rpcURL: string
  public walletAddress?: string
  private signer?: any

  constructor(authSDK: AuthSDK, rpcUrl: string) {
    super()
    this.authSDK = authSDK
    this.rpcURL = rpcUrl
  }

  async getSigner(): Promise<any> {
    if (!this.signer) {
      this.signer = await this.authSDK.getSigner(this.rpcURL)
    }
    return this.signer
  }

  // Implement request method as per EIP-1193 spec
  async request(args: { method: string; params?: Array<any> }): Promise<any> {
    const { method, params } = args

    const _signer = await this.getSigner()

    switch (method) {
      case 'eth_addEthereumChain':
        throw new Error('eth_addEthereumChain not supported')
      case 'eth_chainId':
        return this.authSDK.chainId
      case 'wallet_getPermissions':
        return ['eth_accounts', 'personal_sign', 'eth_sendTransaction']
      case 'eth_accounts':
        this.walletAddress = await _signer.getAddress()
        return [this.walletAddress]
      case 'eth_requestAccounts':
        this.walletAddress = await _signer.getAddress()
        return [this.walletAddress]
      case 'personal_sign':
        if (!params || params.length < 2) {
          throw new Error('personal_sign requires at least 2 parameters')
        }
        console.debug('params[0]: ', params)
        return await _signer.signMessage(params[0])
      case 'eth_sendTransaction':
        if (!params || params.length < 1) {
          throw new Error('eth_sendTransaction requires at least 1 parameter')
        }

        if (params?.[0].from != this.authSDK.walletAddress) {
          throw new Error(`Invalid from address: ${params?.[0].from}`)
        }

        return _signer.sendTransaction(params[0])
      case 'eth_signTransaction':
        if (!params || params.length < 1) {
          throw new Error('eth_signTransaction requires at least 1 parameter')
        }
        return await _signer.signTransaction(params[0])
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  }

  // Implement enable method
  async enable(): Promise<string[]> {
    const accounts = await this.request({ method: 'eth_requestAccounts' })
    this.emit('accountsChanged', accounts)
    return accounts
  }
}

export default EIP1193Provider
