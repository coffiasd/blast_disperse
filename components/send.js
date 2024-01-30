
import { FaEthereum, FaSortNumericDownAlt, FaSortNumericUpAlt } from 'react-icons/fa';
import { alertService } from '../services';
import { useState } from "react";
import Disperse from "../utils/Dis.json";
import ERC20 from "../utils/ERC20.json";
import { ethers } from 'ethers';
import { useAccount } from 'wagmi'
import Link from 'next/link';

export default function Send() {
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }
    const [tab, setTab] = useState(true);
    const [loading, setLoading] = useState("");
    const [tokenAmount, setTokenAmount] = useState("");
    const [ERC20Addr, setERC20Addr] = useState("");
    const [listAddrs, setListAddrs] = useState("");

    //contract.
    const { address, isConnected } = useAccount();
    const Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = Provider.getSigner();
    const connectedContract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, Disperse.abi, signer);
    let ERC20Contract;

    const send = async () => {
        if (!tab) {
            await sendERC20();
            return;
        }
        setLoading("loading");
        setTimeout(() => {
            setLoading("");
        }, 122000);
        let addrsList = [];
        let amountList = [];
        let lines = listAddrs.split("\n");
        lines.forEach((item, index) => {
            let addrs = item.split(" ")[0];
            let amount = item.split(" ")[1];
            addrsList.push(addrs);
            amountList.push(ethers.utils.parseUnits(amount));
        })

        const tx = await connectedContract.disperseEther(addrsList, amountList, {
            // nonce: window.ethersProvider.getTransactionCount(address, "latest"),
            value: ethers.utils.parseUnits(tokenAmount),
            gasLimit: ethers.utils.hexlify(0x100000)
        });

        await waitForTransactionCompletion(tx.hash);
        setLoading("");
    }

    const sendERC20 = async () => {
        if (ERC20Addr != "") {
            ERC20Contract = new ethers.Contract(ERC20Addr, ERC20.abi, signer);
        }
        // setLoading("loading");
        // setTimeout(() => {
        //     setLoading("");
        // }, 10000);
        //check approve.
        const allowance = await ERC20Contract.allowance(address, process.env.NEXT_PUBLIC_CONTRACT_ALL_ADDRESS);
        if (allowance < tokenAmount) {
            //approve
            const app = await ERC20Contract.approve(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, ethers.utils.parseUnits(tokenAmount));
            await waitForTransactionCompletion(app.hash);
            setLoading("");
        }

        let addrsList = [];
        let amountList = [];
        let lines = listAddrs.split("\n");
        lines.forEach((item, index) => {
            let addrs = item.split(" ")[0];
            let amount = item.split(" ")[1];
            addrsList.push(addrs);
            amountList.push(ethers.utils.parseUnits(amount));
        })

        const tx = await connectedContract.disperseToken(ERC20Addr, addrsList, amountList, {
            gasLimit: ethers.utils.hexlify(0x100000)
        });

        await waitForTransactionCompletion(tx.hash);
    }

    async function waitForTransactionCompletion(txHash) {
        let receipt = null;
        while (!receipt) {
            receipt = await new ethers.providers.Web3Provider(window.ethereum).getTransactionReceipt(txHash);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(receipt);
        return receipt;
    }

    function tokenAmountChange(e) {
        setTokenAmount(e.target.value);
    }

    function ERC20AddrChange(e) {
        setERC20Addr(e.target.value);
    }

    function listAddrChange(e) {
        setListAddrs(e.target.value);
    }

    function avg() {
        let lines = listAddrs.split("\n");
        let count = lines.length;
        let single = (tokenAmount / count).toFixed(6);
        let out = "";
        lines.forEach((item, index) => {
            if (item == "" || item == "\n") {
                return;
            }
            item = item.split(" ")[0];
            if (index == count - 1) {
                out += item + " " + single.toString();
            } else {
                out += item + " " + single.toString() + "\n";
            }
        })
        console.log(out);
        setListAddrs(out);
    }

    return (
        <div className="h-auto mt-20 border-solid border-2 rounded-xl">
            <div role="tablist" className="mt-5 tabs tabs-bordered">
                <Link href="#"><a role="tab" onClick={(e) => { setTab(true) }} className={`tab ${tab ? 'tab-active' : ''}`}>ETH</a></Link>
                <Link href="#"><a role="tab" onClick={(e) => { setTab(false) }} className={`tab ${tab ? '' : 'tab-active'}`}>ERC20</a></Link>
            </div>

            <div className="flex flex-col px-5 py-5">
                <div className="h-auto border-solid rounded-2xl my-5 p-2">
                    <div className="flex flex-row p-2 rounded-2xl border-dotted m-3">

                        <div className="flex form-control w-full">
                            <textarea className="min-h-16 textarea textarea-bordered" value={listAddrs} onChange={listAddrChange} placeholder="0x2B0C118838F8e8D2b0d0927294cf8D892d11FD18 3.141592
0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610 2.7182"></textarea>

                            {!tab ? (
                                <div class="mt-5 flex flex-row">
                                    <input type="text" placeholder="ERC20 token address" value={ERC20Addr} onChange={ERC20AddrChange} className="input w-full input-bordered input-primary" />
                                </div>
                            ) : ""}

                            <div class="mt-5 flex flex-row">
                                <input type="text" placeholder="total amount" value={tokenAmount} onChange={tokenAmountChange} className="input input-bordered input-primary w-1/2" />
                                <button className="ml-10 w-1/3 btn" onClick={avg} >Split</button>
                            </div>
                            
                            <div className="mt-10 flex flex-row">
                                <button onClick={send} className={`btn btn-primary rounded-xl w-full`}>
                                    {loading == "" ? "Send" : (<><span className="loading loading-spinner"></span>loading</>)
                                    }
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}