import pyteal as pt
import KrowdFund
import beaker
from algosdk.abi import ABIType

from beaker import sandbox
from beaker.client.api_providers import AlgoNode, Network
from beaker.client import ApplicationClient
from algosdk.atomic_transaction_composer import TransactionWithSigner
from algosdk.transaction import PaymentTxn
from algosdk.encoding import encode_address , decode_address
import base64

funding_codec = ABIType.from_string(str(KrowdFund.Funding().type_spec()))

accts = sandbox.get_accounts()
acct_1 = accts[0]
acct_2 = accts[1]
acct_3 = accts[2]

# client = AlgoNode(Network.TestNet).algod()

client = sandbox.get_algod_client()
app_client1 = beaker.client.ApplicationClient(client=client, app=KrowdFund.app, signer=acct_1.signer)

# 1. CREATE APPLICATION
app_id, app_addr, txid = app_client1.create()
print(f"Created app with id {app_id} and address {app_addr} in transaction {txid}")

app_client1.fund(1 * beaker.consts.algo)

# 2. GET LENGTH OF FUNDINGS
lengthOfFundings = app_client1.call(KrowdFund.getLengthOfFundings)
print(lengthOfFundings.return_value)

# 3. ADD FUNDING
app_client2 = app_client1.prepare(acct_2.signer)

id = 0
_boxName = id.to_bytes(8, 'big')
txn = PaymentTxn(sender=acct_2.address, receiver=app_addr, amt=2000, sp=app_client2.get_suggested_params())
seed = TransactionWithSigner(txn, acct_2.signer)
app_client2.call(KrowdFund.addFunding, seed=seed, name="Charity", description="Donations of clothes and provisions to the less priviledged", amountNeeded=7 * beaker.consts.algo, boxes=[(app_client1.app_id, _boxName)])

print(f"Current app state: {app_client1.get_global_state()}")

# 4. GET SPECIFIC FUNDING
id = 0
_boxName = id.to_bytes(8, 'big')
funding = app_client2.call(KrowdFund.getSpecificFunding, idx=0, boxes=[(app_client1.app_id, _boxName)])
abi_decoded = funding_codec.decode(funding.raw_value)
print(f"Creator: {abi_decoded[0]}")

id = 0
_boxName = id.to_bytes(8, 'big')
funding = funding_codec.decode(app_client1.get_box_contents(_boxName))
print(funding) # same as get specific funding

# 5. DONATE TO FUNDING
txn = PaymentTxn(sender=acct_2.address, receiver=funding[0], amt=2*beaker.consts.algo, sp=app_client2.get_suggested_params())
seed = TransactionWithSigner(txn, acct_2.signer)

app_client2.call(KrowdFund.donateFunds, seed=seed, idx=0, boxes=[(app_client1.app_id, _boxName)])


app_client3 = app_client1.prepare(acct_3.signer)
txn = PaymentTxn(sender=acct_3.address, receiver=funding[0], amt=3*beaker.consts.algo, sp=app_client3.get_suggested_params())
seed = TransactionWithSigner(txn, acct_3.signer)

app_client3.call(KrowdFund.donateFunds, seed=seed, idx=0, boxes=[(app_client1.app_id, _boxName)])

print(f"Current app state: {app_client1.get_global_state()}")

id = 0
_boxName = id.to_bytes(8, 'big')
funding = funding_codec.decode(app_client1.get_box_contents(_boxName))
print(funding) # same as get specific funding

# Edit funding

app_client2.call(KrowdFund.editFunding, idx=0, name="New Charity", description="Donations of clothes and provisions to the new charity", boxes=[(app_client1.app_id, _boxName)])

id = 0
_boxName = id.to_bytes(8, 'big')
funding = funding_codec.decode(app_client1.get_box_contents(_boxName))
print(funding) # same as get specific funding

# NEXT IS FRONTEND WITH BEAKER-TS