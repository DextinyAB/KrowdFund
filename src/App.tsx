import algosdk from "algosdk";
import { useState, useEffect } from "react";
import { clients } from "beaker-ts";
import { KrowdFund } from "./krowdfund_client";

import { AppBar, Box, Grid, Input, Toolbar, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useWalletUI, WalletUI } from '@algoscan/use-wallet-ui'
import Modal from "./components/Modal"

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

export default function App() {
  // Start with no app id for this demo, since we allow creation
  // Otherwise it'd come in as part of conf
  const [appId, setAppId] = useState<number>(166750934);

  // Setup config for client/network.
  const [apiProvider, setApiProvider] = useState(clients.APIProvider.AlgoNode);
  const [network, setNetwork] = useState(clients.Network.TestNet);
  // Init our algod client
  const algodClient = clients.getAlgodClient(apiProvider, network);

  const [loading, setLoading] = useState(false);
  const [modalStatus, setmodalStatus] = useState(false);

  // Set up user wallet from session
  const { activeAccount, signer } = useWalletUI();

  // Init our app client
  const [appClient, setAppClient] = useState<KrowdFund>(
    AnonClient(algodClient, appId)
  );

  // If the account info, client, or app id change
  // update our app client
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
  }, [activeAccount, appId, algodClient]);

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

    const result = await appClient.addFunding({ seed: _seed, name: _name, description: _description, amountNeeded: BigInt(_amountNeeded) * 1000000n, boxes=[]});
    console.log(result.txID);

  }

  async function toggleModal() {
    if(modalStatus) {
      setmodalStatus(false)
    } else {
      setmodalStatus(true)
    }
    console.log(modalStatus)
  }
  // The two actions we allow
  // const action = !appId ? (
  //   <LoadingButton variant="outlined" onClick={createApp} loading={loading}>
  //     Create App
  //   </LoadingButton>
  // ) : (
  //   <div>
  //     <Box>
  //       <Input type="text" id="name" placeholder="what is your name?"></Input>
  //     </Box>
  //     <Box marginTop="10px">
  //       <LoadingButton variant="outlined" onClick={addFunding} loading={loading}>
  //         Greet
  //       </LoadingButton>
  //     </Box>
  //   </div>
  // );

  // The app ui
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="regular">
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <WalletUI openState={false} primary='green' textColor='#FF0000' />
          </Box>
        </Toolbar>
      </AppBar>
      <br/>
      <Button variant="outlined" onClick={toggleModal}>Add Funding</Button>
      <Modal addFunding={addFunding} toggleModal={toggleModal} modalStatus={modalStatus}/>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* <Grid item lg>
          <Box margin="10px">{action}</Box>
        </Grid> */}
        
      </Grid>
    </div>
  );
}
