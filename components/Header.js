import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { FaTwitter, FaGithub, FaYoutube, FaOctopusDeploy } from "react-icons/fa";
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Header() {
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { switchNetwork } = useSwitchNetwork()
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();

    // console.log(chain);
    return (
        <div className="navbar text-neutral-content bg-primary-content">
            <div className="flex-1 ml-3 text-gray-50">
                <ul className='flex flex-row justify-between gap-6'>
                    {/* <li><a href="#"><FaOctopusDeploy className='text-success' size="2rem" /></a></li>
                    <li><a className={styles.leftToRight} href="https://twitter.com/coffiasd"><FaTwitter size="1rem" className='m-0.5' />TWITTER</a></li>
                    <li><a className={styles.leftToRight} href="https://github.com/coffiasd"><FaGithub size="1rem" className='m-0.5' />GITHUB</a></li>
                    <li><a className={styles.leftToRight} href="#"><FaYoutube size="1rem" className='m-0.5' />YOUTUBE</a></li> */}

                    <li className="cursor-pointer">
                        <Link className={styles.logo} href="/">
                            <a>
                                <FaOctopusDeploy className='text-success' size="2.2rem" />
                            </a>
                        </Link>
                    </li>
                    <li className='mt-1'>
                        <Link href="https://twitter.com/nifty12111">
                            <a target="_blank" className={`${styles.leftToRight}`}>
                                <FaTwitter size="1.2rem" />&nbsp;&nbsp;<div className='font-bold'>TWITTER</div>
                            </a>
                        </Link>
                    </li>
                    <li className='mt-1'>
                        <Link href="#">
                            <a target="_blank" className={`${styles.leftToRight}`}>
                                <FaGithub size="1.2rem" className='' />&nbsp;&nbsp;<div className='font-bold'>GITHUB</div>
                            </a>
                        </Link>
                    </li>

                    <li className='mt-1'>
                        <Link href="#">
                            <a target="_blank" className={`${styles.leftToRight}`}>
                                <FaYoutube size="1.2rem" className='' />&nbsp;&nbsp;<div className='font-bold'>YOUTUBE</div>
                            </a>
                        </Link>
                    </li>

                </ul>
            </div>

            <div className="navbar-end">
                {isConnected && chain.id != 168587773 && <button className="btn btn-sm btn-warning ml-3 normal-case" onClick={() => switchNetwork(168587773)}>switch net</button>}

                {isConnected && chain.id == 168587773 &&
                    <><button className="btn btn-sm btn-info ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-error ml-3 normal-case " onClick={openChainModal}>Chain</button></>

                }

                {!isConnected && <button className="btn btn-sm btn-error ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>}
            </div>
        </div >
    )
}