import React, {useMemo} from 'react';
import './App.css';
import {ConnectionProvider, useWallet, WalletProvider} from '@solana/wallet-adapter-react';
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

const Content = () => {
    const wallet = useWallet()
  return <div>Hi {wallet?.publicKey?.toBase58()}!</div>
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
