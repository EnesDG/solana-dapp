import React, {FormEvent, useEffect, useMemo, useState} from 'react';
import './App.css';
import {ConnectionProvider, useConnection, useWallet, WalletProvider} from '@solana/wallet-adapter-react';
import {clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
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

interface FormElements extends HTMLFormControlsCollection {
    address: HTMLInputElement
}
interface TransferForm extends HTMLFormElement {
    readonly elements: FormElements
}

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

const makeTransaction = (connection: Connection, fromPubkey: PublicKey, toPubkey: PublicKey, lamports: number) =>
    new Transaction().add(
        SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports
        })
    )


const Transfer = () => {
    const wallet = useWallet()
    const { connection } = useConnection();
    const [tx, setTx] = useState<string>();
    const [error, setError] = useState<Error>();

    if (!connection || !wallet.connected || !wallet.publicKey) return <></>

    const transferFunds = async (e: FormEvent<TransferForm>) => {
        e.preventDefault();

        const transaction = makeTransaction(
            connection,
            wallet.publicKey!,
            new PublicKey(e.currentTarget.elements.address.value),
            0.1 * 1e9
        );

        wallet.sendTransaction(transaction, connection).then(setTx).catch(setError);
    }

    return <>
        <form onSubmit={transferFunds}>
            Send 0.1 SOL to <input name="address"/>
            <input type="submit" value="Send" />
        </form>
        { tx && <p>Done! <a href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}>View in explorer</a></p>}
        { error && <p>{error.message}</p>}
    </>
}

const Content = () => {
    const wallet = useWallet()
    const balance = useBalance()
    return <div>
        <p>Hi {wallet?.publicKey?.toBase58()}!</p>
        {balance && <p>Your balance is {(balance * 1e-9).toFixed(2)} SOL</p>}
        <Transfer/>
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
