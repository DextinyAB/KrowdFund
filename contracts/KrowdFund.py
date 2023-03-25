import pyteal as pt
# import typing
import beaker
from beaker.lib.storage import BoxMapping
# from beaker.consts import (
#   BOX_BYTE_MIN_BALANCE,
#   BOX_FLAT_MIN_BALANCE,
#   Algo
# )

class Funding(pt.abi.NamedTuple):
  owner: pt.abi.Field[pt.abi.Address]
  name: pt.abi.Field[pt.abi.String]
  description: pt.abi.Field[pt.abi.String]
  date: pt.abi.Field[pt.abi.Uint64]
  amountNeeded: pt.abi.Field[pt.abi.Uint64]
  amountRaised: pt.abi.Field[pt.abi.Uint64]

class KrowdFundState:
  funding_id = beaker.GlobalStateValue(
    pt.TealType.uint64,
    default=pt.Int(0)  
  )


  def __init__(self, *,funding_type: type[pt.abi.BaseType]):
    self.funding_type = funding_type
    self.fundings = BoxMapping(pt.abi.Uint64, funding_type)

    self.minimum_balance = pt.Int(2000)
    # self.minimum_balance = pt.Int(
    #   BOX_FLAT_MIN_BALANCE + (
    #     pt.abi.size_of(funding_type)
    #   ) * BOX_BYTE_MIN_BALANCE
    # )

app = (
  beaker.Application(
  "KrowdFund",
  state=KrowdFundState(funding_type=Funding))
  .apply(beaker.unconditional_create_approval, initialize_global_state=True)
)

@app.external
def addFunding(
  seed: pt.abi.PaymentTransaction,
  name: pt.abi.String,
  description: pt.abi.String,
  amountNeeded: pt.abi.Uint64,
) -> pt.Expr:
  """create new funding"""
  return pt.Seq(
    # 1. Pay for minimum balance
    pt.Assert(
      seed.get().receiver() == pt.Global.current_application_address(),
      seed.get().amount() >= app.state.minimum_balance,
      name.get() != pt.Bytes(""),
      description.get() != pt.Bytes(""),
      amountNeeded.get() > pt.Int(0)

    ),
    # 2. Add funding
    (_owner := pt.abi.Address()).set(pt.Txn.sender()),
    (_name := pt.abi.String()).set(name.get()),
    (_description := pt.abi.String()).set(description.get()),
    (_date := pt.abi.Uint64()).set(pt.Global.latest_timestamp()),
    (_amountNeeded := pt.abi.Uint64()).set(amountNeeded.get()),
    (_amountRaised := pt.abi.Uint64()).set(pt.Int(0)),

    (fd := Funding()).set(_owner, _name, _description, _date, _amountNeeded, _amountRaised),
    app.state.fundings[pt.Itob(app.state.funding_id)].set(fd),

    # 3. Increment funding id
    app.state.funding_id.set(app.state.funding_id + pt.Int(1))
  )

@app.external
def donateFunds(
  seed: pt.abi.PaymentTransaction,
  idx: pt.abi.Uint64
) -> pt.Expr:
  """Donate to a funding"""
  return pt.Seq(

    (new_funding := Funding()).decode(app.state.fundings[idx].get()),
    (_owner := pt.abi.Address()).set(new_funding.owner),
    (_name := pt.abi.String()).set(new_funding.name),
    (_description := pt.abi.String()).set(new_funding.description),
    (_date := pt.abi.Uint64()).set(new_funding.date),
    (_amountNeeded := pt.abi.Uint64()).set(new_funding.amountNeeded),
    (_amountRaised := pt.abi.Uint64()).set(new_funding.amountRaised),

    pt.Assert(
      seed.get().amount() > pt.Int(0),
      seed.get().receiver() == _owner.get()
    ),

    pt.Assert(_amountNeeded.get() > _amountRaised.get()),

    _amountRaised.set(_amountRaised.get() + seed.get().amount()),
    new_funding.set(_owner, _name, _description, _date, _amountNeeded, _amountRaised),
    app.state.fundings[idx].set(new_funding)


  )

# Make 
@app.external
def editFunding(
  idx: pt.abi.Uint64,
  name: pt.abi.String,
  description: pt.abi.String,
):
  return pt.Seq(
    pt.Assert(
      name.get() != pt.Bytes(""),
      description.get() != pt.Bytes("")
    ),

    (new_funding := Funding()).decode(app.state.fundings[idx].get()),
    (_owner := pt.abi.Address()).set(new_funding.owner),
    (_name := pt.abi.String()).set(name.get()),
    (_description := pt.abi.String()).set(description.get()),
    (_date := pt.abi.Uint64()).set(new_funding.date),
    (_amountNeeded := pt.abi.Uint64()).set(new_funding.amountNeeded),
    (_amountRaised := pt.abi.Uint64()).set(new_funding.amountRaised),
    new_funding.set(_owner, _name, _description, _date, _amountNeeded, _amountRaised),
    app.state.fundings[idx].set(new_funding),

    pt.Assert(
      pt.Txn.sender() == _owner.get()
    )
  )

@app.external
def getLengthOfFundings(
  *,
  output: pt.abi.Uint64
):
  return pt.Seq(
    output.set(app.state.funding_id)
  )


@app.external
def getSpecificFunding(
  idx: pt.abi.Uint64,
  *,
  output: Funding
):
  return pt.Seq(
    # return output.decode(self.orders[order_number][Txn.sender()])
    output.decode(app.state.fundings[idx].get())
    
  )





app_spec = app.build()
approval_program, clear_program = app_spec.approval_program, app_spec.clear_program
app_spec.export("artifacts")