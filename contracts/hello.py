from pyteal import Global, abi, Concat, Bytes
from beaker import Application, external, Authorize

# Create a class, subclassing Application from beaker
class HelloBeaker(Application):
    # Add an external method with ABI method signature `hello(string)string`
    @external(authorize=Authorize.only(Global.creator_address()))
    def hello(self, name: abi.String, *, output: abi.String):
        # Set output to the result of `Hello, `+name
        return output.set(Concat(Bytes("Hello, "), name.get()))


if __name__ == "__main__":
    HelloBeaker().dump("./artifacts")
