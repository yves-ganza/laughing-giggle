const {ethers} = require('hardhat')

async function main(){
    const whitelistContract = await ethers.getContractFactory('Whitelist')
    
    console.log('Deploying contract...')
    const deployedContract = await whitelistContract.deploy(10)
    await deployedContract.deployed()
    console.log('Deployed!');
    console.log('Whitelist contract address ', deployedContract.address)
}

main().then(() =>process.exit(0))
.catch(e => {
    console.log(e)
    process.exit(1)
})