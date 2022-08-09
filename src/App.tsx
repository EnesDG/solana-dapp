import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {ConnectionProvider, useConnection, useWallet, WalletProvider} from '@solana/wallet-adapter-react';
import {clusterApiUrl} from "@solana/web3.js";
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SolletWalletAdapter, TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletMultiButton
} from "@solana/wallet-adapter-react-ui";

require('@solana/wallet-adapter-react-ui/styles.css');

const useBalance = () => {
    const wallet = useWallet()
    const { connection } = useConnection();
    const [balance, setBalance] = useState<number>();

    useEffect(() => {
        if (!connection || !wallet.connected || !wallet.publicKey) {
            setBalance(undefined);
            return;
        }

        connection.getBalance(wallet.publicKey).then(setBalance)
    }, [wallet, connection])

    return balance;
};

const Content = () => {
    const wallet = useWallet()
    const balance = useBalance()
    return <div>
        <p>Hi {wallet?.publicKey?.toBase58()}!</p>
        {balance && <p>Your balance is {(balance * 1e-9).toFixed(2)} SOL</p>}
    </div>
}

function App() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new SolletWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <div className="App">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <WalletMultiButton/>
                        <Content />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
}

export default App;
