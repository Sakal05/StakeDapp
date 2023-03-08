import logo from "./logo.svg";
import "./App.css";
import ABI from "./contracts/Staker.json";
import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";

//console.log("ABI: ", ABI);

function App() {
  const { ethers } = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [address, updateAddress] = useState("");

  //const [walletAddress, updateWalletAddress] = useState("");
  const [balance, updateBalance] = useState("");
  const [withDrawalTime, updateWithDrawalTime] = useState("");

  // Define a function to fetch the balance of the signer's wallet address
  const getWalletBalance = async () => {
    try {
      const balance = await signer.getBalance();
      updateBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };

  async function getUserAddress() {
    const address = await signer.getAddress();
    updateAddress(address);
    return address;
  }

  async function Stake() {
    console.log("Contract Address: ", ABI.address);
    console.log("ABI CONTRACT:", ABI.abi);
    const contract = new ethers.Contract(ABI.address, ABI.abi, signer);
    const stake = await contract.stake({
      value: ethers.utils.parseEther("0.001"),
      gasLimit: 150000
    });
    //listeing to event of Staking
    await contract.on("Staked", (account, amount, timestamp) => {
      console.log(`Account ${account} staked ${amount} at timestamp ${timestamp}`);
    });
    //withDrawalTimeLeft();
    return stake;
  }

  async function Withdraw() {
    const contract = new ethers.Contract(ABI.address, ABI.abi, signer);

    const withdraw = await contract.withdraw({gasLimit: 150000});

    await contract.on("Withdrawn", (account, amount, timestamp) => {
        console.log(`Withdrawn Event: \nAccount: ${account} \nAmount: ${amount} \nTimestamp: ${timestamp}`);
    })
    return withdraw;
  }

  // async function Execute() {
  //   const contract = new ethers.Contract(ABI.address, ABI.abi, signer);

  //   const execute = await contract.execute({
  //     gasLimit: 500000, // Set the gas limit to 500,000 (replace with your desired value)
  //   });
  //   return execute;
  // }

  async function Balance() {
    const contract = new ethers.Contract(ABI.address, ABI.abi, signer);
    // Get the balance of the current user
    const currentUserAddress = await signer.getAddress();
    const balance = await contract.balanceOf(currentUserAddress);
    // const readableBalance = new BigNumber(balance)
    //   .dividedBy(10 ** 18)
    //   .toFixed(2);
    //console.log(readableBalance.fixed(18)); // show the balance
    updateBalance(balance.toString());
    return balance;
  }

  // async function withDrawalTimeLeft() {
  //   const contract = new ethers.Contract(ABI.address, ABI.abi, signer);
  //   // Check the time remaining before the minimum staking period has passed
  //   const timeRemaining = await contract.withdrawalTimeLeft();
  //   console.log(`Time remaining: ${timeRemaining} seconds`);
  //   updateWithDrawalTime(timeRemaining);
  // }

  // async function emitEvent() {
  //   const contract = new ethers.Contract(ABI.address, ABI.abi, signer);
  //   const transaction = await contract.stake();
  //   await transaction.wait(); // wait for the transaction to be mined
  //   const event = transaction.events.find((event) => event.event === "Stake");
  //   console.log(event.args.sender, event.args.amount); // show the event arguments
  // }

  // async function rewardRatePerSecond() {
  //   const contract = new ethers.Contract(ABI.address, ABI.abi, signer);
  //   const RPS = await contract.rewardRatePerSecond();
  //   console.log("Reward Rate Per Second: ", RPS);
  // }

  // Call the getWalletBalance function after updating the wallet address
  useEffect(() => {
    getWalletBalance();
    getUserAddress();
    Balance();
    // rewardRatePerSecond();
    console.log("Contract Address: ", ABI.address);
    console.log("ABI CONTRACT: ", ABI.abi);
    console.log("Balance: ", balance)
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Contract Address: {ABI.address}</p>

        <p>User Address: {address}</p>
        <p>User Balance: {balance}</p>
        {/* <h3> WithDrawal Time: {withDrawalTime}</h3> */}
        <p>Please click here to stake</p>
        <button className="btn" onClick={Stake}>
          Stake 0.001 ether
        </button>
        <button className="btn" onClick={Withdraw}>
          Withdraw
        </button>
        {/* <button className="btn" onClick={Execute}>
          Execute
        </button> */}

    
      </header>
    </div>
  );
}

export default App;
