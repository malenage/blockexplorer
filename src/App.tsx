import { Alchemy, Network, AssetTransfersCategory, AssetTransfersResponse, TransactionReceipt } from 'alchemy-sdk';
import { useEffect, useState, FormEvent} from 'react';
import ListGroup from './components/ListGroup';
import './App.css';
import { Alert } from './components/Alert';
// import { Button } from './components/Button';
import Form from './components/Form';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

interface Block {
  hash: string;
  parentHash: string;
  number: number;
  timestamp: number;
  nonce: string;
  difficulty: number;
  gasLimit: Object;
  gasUsed: Object;
  transactions: Array<Object>;
}

interface Transaction {
  hash?: string;
  transactionHash?: string;
  blockHash?: string;
  blockNum?: number;
  from?: string;
  to?: string;
  value?: number;
  asset?: string;
  category?: string;
  contractAddress?: string;
}

function App() {
  const [blockNumber = 0, setBlockNumber] = useState<number | undefined>(1);
  const [latestBlock, setLatestBlock] = useState<Block | undefined>();
  const [alertVisible, setalertVisible] = useState(false);
  const [alertTransactionVisible, setalertTransactionVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [ethBalance, setEthBalance] = useState<number | undefined>();
  const [balance, setBalance] = useState<Array<string>>(['']);
  const [addressTransactions, setAddressTransactions] = useState<AssetTransfersResponse | undefined>();
  const [transaction, setTransaction] = useState<Transaction | TransactionReceipt | undefined>({transactionHash: '', from: '', to: '', contractAddress:'', value: 0});

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    getBlockNumber();
  
    async function getLatestBlock() {
      setLatestBlock(await alchemy.core.getBlockWithTransactions(blockNumber));
    }
    getLatestBlock();

  });

  let blocks = [blockNumber, blockNumber -1, blockNumber -2, blockNumber -3, blockNumber-4];
  let transactionss = latestBlock?.transactions ? latestBlock.transactions : [];
  transactionss = transactionss.map((trans: any) => trans.hash);
  transactionss = transactionss.slice(0,5);
  let addressBalances: string[] = [];
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  // interface TokenBalances {
  //   contractAddress: string;
  //   tokenBalance: string;
  // }

  const handleAddressSearch = async(event: FormEvent<HTMLFormElement>, address: string) => {
    event.preventDefault();
    setalertTransactionVisible(false);
    setalertVisible(true);
    // addressresult = await alchemy.core.getTransactionCount(address);
    let ethBalance = await alchemy.core.getBalance(address, "latest");
    let ethBalanceNumber = ethBalance/Math.pow(10, 18);
    setEthBalance(ethBalanceNumber)
    const balances = await alchemy.core.getTokenBalances(address);
    const tokenBalances = balances.tokenBalances;
    let transactionsResult = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155]
    });
    // console.log('transactionsResult ' + transactionsResult);
    // transactionsResult.map(transaction => {console.log(JSON.stringify(transaction));})
    setAddressTransactions(transactionsResult);
    // for (let tr of addressTransactions) {
    //   console.log(JSON.stringify(tr));
    // }
    for (let balance of tokenBalances) {
      let balanceAddress = balance.contractAddress;
      let tokenBalance = (balance?.tokenBalance) ? balance?.tokenBalance : '';
      const metadata = await alchemy.core.getTokenMetadata(balanceAddress);
      const decimals = (metadata.decimals) ? metadata.decimals : 0;
      let formattedTokenBalance = parseInt(tokenBalance)/Math.pow(10, decimals);
      addressBalances.push(metadata.name + ' ' + formattedTokenBalance);
      setBalance(addressBalances);
    }
  };

  const handleTransactionSearch = async(transactionHash: string) => {
    // event.preventDefault();
    const transactionInfo = await alchemy.core.getTransactionReceipt(transactionHash);
    setalertVisible(false);
    setalertTransactionVisible(true);
    setTransaction(transactionInfo);
  };
  
  return <div>
    <div className="container text-center">
    <div className="row">
      <Form label="Search by Address"
        type="text"
        id="address"
        buttonText="Search"
        placeholder="0x..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onSubmit={(e) => handleAddressSearch(e, address) } />
    </div>
      <div className="row">
          <div className="col">
            <ListGroup items={blocks} heading="Latest Blocks" onSelectItem={handleSelectItem}/>
          </div>
          <div className="col">
            <ListGroup items={transactionss} heading="Latest Transactions" onSelectItem={handleTransactionSearch}/>
          </div>
      </div>
      <div className="row">
      { alertVisible && <Alert onClose={() => setalertVisible(false)}>
        <p>Address: {address}</p>
        <p> ETH BALANCE: {ethBalance}</p>
        {balance.map((item, index) => (
          <p>{item}</p>
        ))}
        {/* <p>{addressTransactions}</p> */}
      </Alert>}
      </div>
      <div className="row">
      { alertTransactionVisible && <Alert onClose={() => setalertTransactionVisible(false)}>
        <p>Hash: {transaction.transactionHash}</p>
        <p> From: {transaction.from}</p>
        <p> To: {transaction.to}</p>
        <p> Contract Address: {transaction.contractAddress}</p>
        <p> Value: {transaction.value}</p>
      </Alert>}
      </div>
    </div>
    {/* <Button color="secondary" onClick={() => setalertVisible(true)}>
      Press me
    </Button> */}
    </div>;
}

export default App;
