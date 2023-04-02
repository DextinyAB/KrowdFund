// @ts-nocheck 

import algosdk from "algosdk";
import { useState, useEffect } from "react";
import { clients } from "beaker-ts";
import { KrowdFund } from "./krowdfund_client";

import { AppBar, Box, Toolbar, Button } from "@mui/material";

import { useWalletUI, WalletUI } from '@algoscan/use-wallet-ui/dist/index.js'
import Modals from "./components/Modals"



// If you just need a placeholder signer
const PlaceHolderSigner: algosdk.TransactionSigner = (
  _txnGroup: algosdk.Transaction[],
  _indexesToSign: number[],
): Promise<Uint8Array[]> => {
  return Promise.resolve([]);
};

// AnonClient can still allow reads for an app but no transactions
// can be signed
const AnonClient = (client: algosdk.Algodv2, appId: number): KrowdFund => {
  return new KrowdFund({
    // @ts-ignore
    client: client,
    signer: PlaceHolderSigner,
    sender: "",
    appId: appId,
  });
};


interface fundingItemProps {
  _id: bigint,
  owner: string,
  name: string,
  description: string,
  date: bigint,
  amountNeeded: number,
  amountRaised: number,
}

// interface FundingProps {

// }
export default function App() {

  // Start with no app id for this demo, since we allow creation
  // Otherwise it'd come in as part of conf

  const [appId, setAppId] = useState<number>(171237480);
  

  // Setup config for client/network.
  const [apiProvider, setApiProvider] = useState(clients.APIProvider.AlgoNode);
  const [network, setNetwork] = useState(clients.Network.TestNet);
  // Init our algod client
  const algodClient = clients.getAlgodClient(apiProvider, network);

  const [loading, setLoading] = useState(false);
  const [modalStatus, setmodalStatus] = useState(false);
  const [fundings, setFundings] = useState([]);
  const [amount, setAmount] = useState<bigint>(0n);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");


  // Set up user wallet from session
  const { activeAccount, signer } = useWalletUI();

  // Init our app client
  const [appClient, setAppClient] = useState<KrowdFund>(
    AnonClient(algodClient, appId)
  );

  // If the account info, client, or app id change
  // update our app client
    async function _getFundings() {
      await getFundings()
      .then((_fundings: fundingItemProps[]) => {
        // console.log(_fundings)

        setFundings(_fundings)

      })
    }

  useEffect(() => {
    console.log(activeAccount, appId, algodClient)
    // Bad way to track connected status but...
    if (activeAccount === null && appClient.sender !== "") {
      setAppClient(AnonClient(algodClient, appId));
    } else if (
      activeAccount && activeAccount.address != appClient.sender
    ) {
      setAppClient(
        new KrowdFund({
          client: algodClient,
          signer: signer,
          sender: activeAccount.address,
          appId: appId,
        })
      );
    }
    _getFundings()
  }, [activeAccount]);

  // Deploy the app on chain
  // async function createApp() {
  //   setLoading(true);
  //   console.log(appClient)
  //   const { appId, appAddress, txId } = await appClient.create();
  //   console.log(appId)
  //   console.log(appAddress)
  //   console.log(txId)
  //   setAppId(appId);
  //   alert(`Created app: ${appId}`);
  //   setLoading(false);
  // }


  async function addFunding(_name: string, _description: string, _amountNeeded: bigint) {

    let _seed = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: activeAccount?.address ? activeAccount.address : "",
      suggestedParams: await algodClient.getTransactionParams().do(),
      to: algosdk.getApplicationAddress(appId),
      amount: BigInt(2000)
    })

    // Get length of box
    let _length = 0;
    for(let boxes in await appClient.getApplicationBoxNames()) {
      if(boxes != "hello") {
        console.log(boxes)
        _length++;
      }
    }
    // console.log(_length)

    const boxName = _length;
    const result = await appClient.addFunding({ seed: _seed, name: _name, description: _description, amountNeeded: BigInt(_amountNeeded) * 1000000n}, {
      boxes: [{
        appIndex: appId,
        name: algosdk.bigIntToBytes(Number(boxName), 8)
      }]
    });
    // console.log(result.txID);
    _getFundings()

  }

  async function getFundings() {

    const fundings = [];
    for(let boxName in await appClient.getApplicationBoxNames()) {
      if(boxName != "hello") {
        console.log(boxName)
        const idx = algosdk.bigIntToBytes(Number(boxName), 8);
        const result = await appClient.getApplicationBox(idx)
        const resultCodec = algosdk.ABIType.from('(address,string,string,uint64,uint64,uint64)')
        const val = resultCodec.decode(result)
        let obj = {
          _id: boxName,
          owner: val[0],
          name: val[1],
          description: val[2],
          date: Number(val[3]),
          amountNeeded: Number(val[4]),
          amountRaised: Number(val[5]),
        }
        fundings.push(obj)
      }
    }
    // console.log(fundings)
    return fundings;
    

  }
  
  async function donateFunds(_idx: bigint, _owner: string, _amount: bigint) {
    let _seed = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: activeAccount?.address ? activeAccount.address : "",
      suggestedParams: await algodClient.getTransactionParams().do(),
      to: _owner,
      amount: BigInt(_amount) * 1000000n
    })
    const result = await appClient.donateFunds({ seed: _seed, idx: BigInt(_idx)}, {
      boxes: [{
        appIndex: appId,
        name: algosdk.bigIntToBytes(Number(_idx), 8)
      }]
    });

    _getFundings()
  }
  
  async function editFunding(_idx: bigint, _name: string, _description: string) {

    const result = await appClient.editFunding({ idx: BigInt(_idx), name: _name, description: _description}, {
      boxes: [{
        appIndex: appId,
        name: algosdk.bigIntToBytes(Number(_idx), 8)
      }]
    });
    _getFundings()
  }
  async function toggleModal() {
    if(modalStatus) {
      setmodalStatus(false)
    } else {
      setmodalStatus(true)
    }
    // console.log(modalStatus)
  }

  // The app ui
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="regular">
        <h1>KROWDFUND</h1>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <WalletUI openState={false} primary='green' textColor='#FF0000' />
          </Box>
        </Toolbar>
      </AppBar>
      <br/>
      <Button variant="outlined" onClick={toggleModal}>Add Funding</Button>

      <Modals addFunding={addFunding} toggleModal={toggleModal} modalStatus={modalStatus}/>
      <br /> <br />
      
            {/* // <Grid item xs spacing={2}>
            //   <Box sx={{ border: 1 }}>
            //     <Typography variant="h5">{_funding.name}</Typography>
            //     <Typography variant="h6">{_funding.description}</Typography>
            //     <Typography variant="h6">
            //     <b>{algosdk.microalgosToAlgos(_funding.amountRaised)}/{algosdk.microalgosToAlgos(_funding.amountNeeded)} Algo</b> 
            //     </Typography> <br />
            //     <TextField id="outlined-basic" label="Donate" variant="outlined" /><br /><br />
            //     <Button variant="contained" onClick={toggleModal}>Donate Algo</Button> 
            //     <Button variant="contained" onClick={toggleModal}>Edit Funding</Button>
            //   </Box>

            // </Grid> */}
      <div className="grid grid-cols-3 gap-4 mx-10">
        {fundings && fundings.map((_funding: fundingItemProps) => (
          <div className="shadow-md p-5">
            <h2><u>{_funding.name}</u></h2>
            <h2>{_funding.description}</h2> <br />
            <h2 className="text-2xl"><b>{algosdk.microalgosToAlgos(_funding.amountRaised)}/{algosdk.microalgosToAlgos(_funding.amountNeeded)} Algo</b></h2>
            <br />
            <input type="number" className="border-2 p-2" placeholder="Amount in Algo"
            onChange={(e) => {setAmount(e.target.value as unknown as bigint)}}
            />
            <button
              type="button"
              className="uploadcare--button_primary inline-block rounded-full px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
              onClick={() => donateFunds(_funding._id, _funding.owner, amount)}
              >
              Donate Algo
            </button> <br /><br />
            <input type="text" className="border-2 p-2" placeholder="Name"
            value={name}
            onChange={(e) => {setName(e.target.value)}}
            />
            <input type="text" className="border-2 p-2" placeholder="Description"
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
            />
            <button
              type="button"
              className="uploadcare--button_primary inline-block rounded-full px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
              onClick={() => {
                editFunding(_funding._id, name, description);
                setName("")
                setDescription("")
              }}
              >
              Edit Funding
            </button>
          </div>
        ))}
      </div>
      {/* <button onClick={() => createApp()}>createApp</button> */}
      
    </div>
  );
}
