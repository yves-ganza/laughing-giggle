import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Web3Modal from 'web3modal'
import { Contract, ethers, providers } from 'ethers'
import React, {useState, useRef, useEffect} from 'react'
import { abi, CONTRACT_ADDRESS } from '../constants'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [joinedWhitelist, setJoinedWhitelist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0)
  const web3ModalRef = useRef()

 
  const getProviderOrSigner = async (needSigner=false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const {chainId} = await web3Provider.getNetwork()
    if(chainId !== 4) {
      window.alert('Change network to Rinkeby')
      setError('⚠️ Change network to Rinkeby')
    }

    if(needSigner){
      const signer = web3Provider.getSigner()
      return signer
    }

    return web3Provider
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer)
      
      const tx = await contract.addAddressTowhitelist()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      
      await getNumberOfWhitelisted()
      setJoinedWhitelist(true)
      setError('')
      
    } catch (error) {
      console.log(error)
      setError('❌ Transaction Failed!')
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const contract = new Contract(CONTRACT_ADDRESS, abi, provider)
  
      const _numberOfWhitelisted = await contract.numOfAddressesWhitelisted()
      setNumOfWhitelisted(_numberOfWhitelisted) 
    } catch (error) {
      console.log(error)
      setError('❌ Transaction Failed!')
    }
  }

  const checkIfWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer)
      const address = await signer.getAddress()
      const _joinedWhitelist = await contract.whitelistedAddresses(address)
      setJoinedWhitelist(_joinedWhitelist)
      setError('')
    } catch (error) {
      console.log(error)
      setError('❌ Transaction Failed!')
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
      getNumberOfWhitelisted()
      checkIfWhitelisted()
      setError('')
    } catch (error) {
      console.log(error)
      setError('❌ Failed to connect to wallet!')
    }
  }

  const renderButton = () => {
    if(walletConnected){
      if(joinedWhitelist){
        return(
          <div className={`${styles.description} ${styles.bg__shadow}`}>
            ⚒︎Thanks for joining the Whitelist!⚒︎
            <div className={styles.shadow}></div>
          </div>
        )
      }
      else if(loading){
        return (
          <button className={styles.button}>Loading...</button>
        )
      }
      else {
        return (
          <button className={styles.button} onClick={addAddressToWhitelist}>Join WHitelist</button>
        )
      }
    }
    else {
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect Your Wallet
        </button>
      )
    }
  }

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false
      })

      connectWallet()
    }
    setError('')
  }, [walletConnected])

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name='description' content='Whitelist-Dapp'/>
      </Head>
      <div className={styles.main}>
        {
          error ? window.alert(error) : ''
        }
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div>
            Its an NFT collection for developers in Crypto
          </div>
          <div className={styles.description}>
            {numOfWhitelisted} has already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img src='/crypto-devs.svg' className={styles.image} />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by YG
      </footer>
    </div>
  )
}
