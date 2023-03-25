import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class Funding {
    owner: string = "";
    name: string = "";
    description: string = "";
    date: bigint = BigInt(0);
    amountNeeded: bigint = BigInt(0);
    amountRaised: bigint = BigInt(0);
    static codec: algosdk.ABIType = algosdk.ABIType.from("(address,string,string,uint64,uint64,uint64)");
    static fields: string[] = ["owner", "name", "description", "date", "amountNeeded", "amountRaised"];
    static decodeResult(val: algosdk.ABIValue | undefined): Funding {
        return bkr.decodeNamedTuple(val, Funding.fields) as Funding;
    }
    static decodeBytes(val: Uint8Array): Funding {
        return bkr.decodeNamedTuple(Funding.codec.decode(val), Funding.fields) as Funding;
    }
}
export class KrowdFund extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: { funding_id: { type: bkr.AVMType.uint64, key: "funding_id", desc: "", static: false } }, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKaW50Y2Jsb2NrIDAgMSA2MCA2NTUzNgpieXRlY2Jsb2NrIDB4IDB4NjY3NTZlNjQ2OTZlNjc1ZjY5NjQgMHgxNTFmN2M3NQp0eG4gTnVtQXBwQXJncwppbnRjXzAgLy8gMAo9PQpibnogbWFpbl9sMTIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMApwdXNoYnl0ZXMgMHgyODQxMTU0NCAvLyAiYWRkRnVuZGluZyhwYXksc3RyaW5nLHN0cmluZyx1aW50NjQpdm9pZCIKPT0KYm56IG1haW5fbDExCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4ZjMyMTk5M2QgLy8gImRvbmF0ZUZ1bmRzKHBheSx1aW50NjQpdm9pZCIKPT0KYm56IG1haW5fbDEwCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4YjE2MTM3MjAgLy8gImVkaXRGdW5kaW5nKHVpbnQ2NCxzdHJpbmcsc3RyaW5nKXZvaWQiCj09CmJueiBtYWluX2w5CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4NDQxZDUzYmUgLy8gImdldExlbmd0aE9mRnVuZGluZ3MoKXVpbnQ2NCIKPT0KYm56IG1haW5fbDgKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMApwdXNoYnl0ZXMgMHg5OGExNTcxZCAvLyAiZ2V0U3BlY2lmaWNGdW5kaW5nKHVpbnQ2NCkoYWRkcmVzcyxzdHJpbmcsc3RyaW5nLHVpbnQ2NCx1aW50NjQsdWludDY0KSIKPT0KYm56IG1haW5fbDcKZXJyCm1haW5fbDc6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKYnRvaQpjYWxsc3ViIGdldFNwZWNpZmljRnVuZGluZ181CnN0b3JlIDEwCmJ5dGVjXzIgLy8gMHgxNTFmN2M3NQpsb2FkIDEwCmNvbmNhdApsb2cKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDg6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CmNhbGxzdWIgZ2V0TGVuZ3RoT2ZGdW5kaW5nc180CnN0b3JlIDkKYnl0ZWNfMiAvLyAweDE1MWY3Yzc1CmxvYWQgOQppdG9iCmNvbmNhdApsb2cKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDk6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKYnRvaQpzdG9yZSA2CnR4bmEgQXBwbGljYXRpb25BcmdzIDIKc3RvcmUgNwp0eG5hIEFwcGxpY2F0aW9uQXJncyAzCnN0b3JlIDgKbG9hZCA2CmxvYWQgNwpsb2FkIDgKY2FsbHN1YiBlZGl0RnVuZGluZ18zCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxMDoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpidG9pCnN0b3JlIDUKdHhuIEdyb3VwSW5kZXgKaW50Y18xIC8vIDEKLQpzdG9yZSA0CmxvYWQgNApndHhucyBUeXBlRW51bQppbnRjXzEgLy8gcGF5Cj09CmFzc2VydApsb2FkIDQKbG9hZCA1CmNhbGxzdWIgZG9uYXRlRnVuZHNfMgppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTE6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKc3RvcmUgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCnN0b3JlIDIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwpidG9pCnN0b3JlIDMKdHhuIEdyb3VwSW5kZXgKaW50Y18xIC8vIDEKLQpzdG9yZSAwCmxvYWQgMApndHhucyBUeXBlRW51bQppbnRjXzEgLy8gcGF5Cj09CmFzc2VydApsb2FkIDAKbG9hZCAxCmxvYWQgMgpsb2FkIDMKY2FsbHN1YiBhZGRGdW5kaW5nXzEKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEyOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CmJueiBtYWluX2wxNAplcnIKbWFpbl9sMTQ6CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCj09CmFzc2VydApjYWxsc3ViIGNyZWF0ZV8wCmludGNfMSAvLyAxCnJldHVybgoKLy8gY3JlYXRlCmNyZWF0ZV8wOgpwcm90byAwIDAKYnl0ZWNfMSAvLyAiZnVuZGluZ19pZCIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKcmV0c3ViCgovLyBhZGRGdW5kaW5nCmFkZEZ1bmRpbmdfMToKcHJvdG8gNCAwCmJ5dGVjXzAgLy8gIiIKZHVwbiAyCmludGNfMCAvLyAwCmR1cG4gMgpieXRlY18wIC8vICIiCmludGNfMCAvLyAwCmR1cApieXRlY18wIC8vICIiCmR1cApmcmFtZV9kaWcgLTQKZ3R4bnMgUmVjZWl2ZXIKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKPT0KYXNzZXJ0CmZyYW1lX2RpZyAtNApndHhucyBBbW91bnQKcHVzaGludCAyMDAwIC8vIDIwMDAKPj0KYXNzZXJ0CmZyYW1lX2RpZyAtMwpleHRyYWN0IDIgMApieXRlY18wIC8vICIiCiE9CmFzc2VydApmcmFtZV9kaWcgLTIKZXh0cmFjdCAyIDAKYnl0ZWNfMCAvLyAiIgohPQphc3NlcnQKZnJhbWVfZGlnIC0xCmludGNfMCAvLyAwCj4KYXNzZXJ0CnR4biBTZW5kZXIKZnJhbWVfYnVyeSAwCmZyYW1lX2RpZyAwCmxlbgpwdXNoaW50IDMyIC8vIDMyCj09CmFzc2VydApmcmFtZV9kaWcgLTMKZXh0cmFjdCAyIDAKZnJhbWVfYnVyeSAxCmZyYW1lX2RpZyAxCmxlbgppdG9iCmV4dHJhY3QgNiAwCmZyYW1lX2RpZyAxCmNvbmNhdApmcmFtZV9idXJ5IDEKZnJhbWVfZGlnIC0yCmV4dHJhY3QgMiAwCmZyYW1lX2J1cnkgMgpmcmFtZV9kaWcgMgpsZW4KaXRvYgpleHRyYWN0IDYgMApmcmFtZV9kaWcgMgpjb25jYXQKZnJhbWVfYnVyeSAyCmdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKZnJhbWVfYnVyeSAzCmZyYW1lX2RpZyAtMQpmcmFtZV9idXJ5IDQKaW50Y18wIC8vIDAKZnJhbWVfYnVyeSA1CmZyYW1lX2RpZyAwCmZyYW1lX2RpZyAxCmZyYW1lX2J1cnkgMTAKZnJhbWVfZGlnIDEwCmZyYW1lX2J1cnkgOQppbnRjXzIgLy8gNjAKZnJhbWVfYnVyeSA3CmZyYW1lX2RpZyA3CmZyYW1lX2RpZyAxMApsZW4KKwpmcmFtZV9idXJ5IDgKZnJhbWVfZGlnIDgKaW50Y18zIC8vIDY1NTM2CjwKYXNzZXJ0CmZyYW1lX2RpZyA3Cml0b2IKZXh0cmFjdCA2IDAKY29uY2F0CmZyYW1lX2RpZyAyCmZyYW1lX2J1cnkgMTAKZnJhbWVfZGlnIDkKZnJhbWVfZGlnIDEwCmNvbmNhdApmcmFtZV9idXJ5IDkKZnJhbWVfZGlnIDgKZnJhbWVfYnVyeSA3CmZyYW1lX2RpZyA3Cml0b2IKZXh0cmFjdCA2IDAKY29uY2F0CmZyYW1lX2RpZyAzCml0b2IKY29uY2F0CmZyYW1lX2RpZyA0Cml0b2IKY29uY2F0CmZyYW1lX2RpZyA1Cml0b2IKY29uY2F0CmZyYW1lX2RpZyA5CmNvbmNhdApmcmFtZV9idXJ5IDYKYnl0ZWNfMSAvLyAiZnVuZGluZ19pZCIKYXBwX2dsb2JhbF9nZXQKaXRvYgpib3hfZGVsCnBvcApieXRlY18xIC8vICJmdW5kaW5nX2lkIgphcHBfZ2xvYmFsX2dldAppdG9iCmZyYW1lX2RpZyA2CmJveF9wdXQKYnl0ZWNfMSAvLyAiZnVuZGluZ19pZCIKYnl0ZWNfMSAvLyAiZnVuZGluZ19pZCIKYXBwX2dsb2JhbF9nZXQKaW50Y18xIC8vIDEKKwphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIGRvbmF0ZUZ1bmRzCmRvbmF0ZUZ1bmRzXzI6CnByb3RvIDIgMApieXRlY18wIC8vICIiCmR1cG4gMwppbnRjXzAgLy8gMApkdXBuIDQKYnl0ZWNfMCAvLyAiIgpkdXAKZnJhbWVfZGlnIC0xCml0b2IKYm94X2dldApzdG9yZSAxMgpzdG9yZSAxMQpsb2FkIDEyCmFzc2VydApsb2FkIDExCmZyYW1lX2J1cnkgMApmcmFtZV9kaWcgMApleHRyYWN0IDAgMzIKZnJhbWVfYnVyeSAxCmZyYW1lX2RpZyAwCmZyYW1lX2RpZyAwCnB1c2hpbnQgMzIgLy8gMzIKZXh0cmFjdF91aW50MTYKZnJhbWVfZGlnIDAKcHVzaGludCAzNCAvLyAzNApleHRyYWN0X3VpbnQxNgpzdWJzdHJpbmczCmZyYW1lX2J1cnkgMgpmcmFtZV9kaWcgMApmcmFtZV9kaWcgMApwdXNoaW50IDM0IC8vIDM0CmV4dHJhY3RfdWludDE2CmRpZyAxCmxlbgpzdWJzdHJpbmczCmZyYW1lX2J1cnkgMwpmcmFtZV9kaWcgMApwdXNoaW50IDM2IC8vIDM2CmV4dHJhY3RfdWludDY0CmZyYW1lX2J1cnkgNApmcmFtZV9kaWcgMApwdXNoaW50IDQ0IC8vIDQ0CmV4dHJhY3RfdWludDY0CmZyYW1lX2J1cnkgNQpmcmFtZV9kaWcgMApwdXNoaW50IDUyIC8vIDUyCmV4dHJhY3RfdWludDY0CmZyYW1lX2J1cnkgNgpmcmFtZV9kaWcgLTIKZ3R4bnMgQW1vdW50CmludGNfMCAvLyAwCj4KYXNzZXJ0CmZyYW1lX2RpZyAtMgpndHhucyBSZWNlaXZlcgpmcmFtZV9kaWcgMQo9PQphc3NlcnQKZnJhbWVfZGlnIDUKZnJhbWVfZGlnIDYKPgphc3NlcnQKZnJhbWVfZGlnIDYKZnJhbWVfZGlnIC0yCmd0eG5zIEFtb3VudAorCmZyYW1lX2J1cnkgNgpmcmFtZV9kaWcgMQpmcmFtZV9kaWcgMgpmcmFtZV9idXJ5IDEwCmZyYW1lX2RpZyAxMApmcmFtZV9idXJ5IDkKaW50Y18yIC8vIDYwCmZyYW1lX2J1cnkgNwpmcmFtZV9kaWcgNwpmcmFtZV9kaWcgMTAKbGVuCisKZnJhbWVfYnVyeSA4CmZyYW1lX2RpZyA4CmludGNfMyAvLyA2NTUzNgo8CmFzc2VydApmcmFtZV9kaWcgNwppdG9iCmV4dHJhY3QgNiAwCmNvbmNhdApmcmFtZV9kaWcgMwpmcmFtZV9idXJ5IDEwCmZyYW1lX2RpZyA5CmZyYW1lX2RpZyAxMApjb25jYXQKZnJhbWVfYnVyeSA5CmZyYW1lX2RpZyA4CmZyYW1lX2J1cnkgNwpmcmFtZV9kaWcgNwppdG9iCmV4dHJhY3QgNiAwCmNvbmNhdApmcmFtZV9kaWcgNAppdG9iCmNvbmNhdApmcmFtZV9kaWcgNQppdG9iCmNvbmNhdApmcmFtZV9kaWcgNgppdG9iCmNvbmNhdApmcmFtZV9kaWcgOQpjb25jYXQKZnJhbWVfYnVyeSAwCmZyYW1lX2RpZyAtMQppdG9iCmJveF9kZWwKcG9wCmZyYW1lX2RpZyAtMQppdG9iCmZyYW1lX2RpZyAwCmJveF9wdXQKcmV0c3ViCgovLyBlZGl0RnVuZGluZwplZGl0RnVuZGluZ18zOgpwcm90byAzIDAKYnl0ZWNfMCAvLyAiIgpkdXBuIDMKaW50Y18wIC8vIDAKZHVwbiA0CmJ5dGVjXzAgLy8gIiIKZHVwCmZyYW1lX2RpZyAtMgpleHRyYWN0IDIgMApieXRlY18wIC8vICIiCiE9CmFzc2VydApmcmFtZV9kaWcgLTEKZXh0cmFjdCAyIDAKYnl0ZWNfMCAvLyAiIgohPQphc3NlcnQKZnJhbWVfZGlnIC0zCml0b2IKYm94X2dldApzdG9yZSAxNApzdG9yZSAxMwpsb2FkIDE0CmFzc2VydApsb2FkIDEzCmZyYW1lX2J1cnkgMApmcmFtZV9kaWcgMApleHRyYWN0IDAgMzIKZnJhbWVfYnVyeSAxCmZyYW1lX2RpZyAtMgpleHRyYWN0IDIgMApmcmFtZV9idXJ5IDIKZnJhbWVfZGlnIDIKbGVuCml0b2IKZXh0cmFjdCA2IDAKZnJhbWVfZGlnIDIKY29uY2F0CmZyYW1lX2J1cnkgMgpmcmFtZV9kaWcgLTEKZXh0cmFjdCAyIDAKZnJhbWVfYnVyeSAzCmZyYW1lX2RpZyAzCmxlbgppdG9iCmV4dHJhY3QgNiAwCmZyYW1lX2RpZyAzCmNvbmNhdApmcmFtZV9idXJ5IDMKZnJhbWVfZGlnIDAKcHVzaGludCAzNiAvLyAzNgpleHRyYWN0X3VpbnQ2NApmcmFtZV9idXJ5IDQKZnJhbWVfZGlnIDAKcHVzaGludCA0NCAvLyA0NApleHRyYWN0X3VpbnQ2NApmcmFtZV9idXJ5IDUKZnJhbWVfZGlnIDAKcHVzaGludCA1MiAvLyA1MgpleHRyYWN0X3VpbnQ2NApmcmFtZV9idXJ5IDYKZnJhbWVfZGlnIDEKZnJhbWVfZGlnIDIKZnJhbWVfYnVyeSAxMApmcmFtZV9kaWcgMTAKZnJhbWVfYnVyeSA5CmludGNfMiAvLyA2MApmcmFtZV9idXJ5IDcKZnJhbWVfZGlnIDcKZnJhbWVfZGlnIDEwCmxlbgorCmZyYW1lX2J1cnkgOApmcmFtZV9kaWcgOAppbnRjXzMgLy8gNjU1MzYKPAphc3NlcnQKZnJhbWVfZGlnIDcKaXRvYgpleHRyYWN0IDYgMApjb25jYXQKZnJhbWVfZGlnIDMKZnJhbWVfYnVyeSAxMApmcmFtZV9kaWcgOQpmcmFtZV9kaWcgMTAKY29uY2F0CmZyYW1lX2J1cnkgOQpmcmFtZV9kaWcgOApmcmFtZV9idXJ5IDcKZnJhbWVfZGlnIDcKaXRvYgpleHRyYWN0IDYgMApjb25jYXQKZnJhbWVfZGlnIDQKaXRvYgpjb25jYXQKZnJhbWVfZGlnIDUKaXRvYgpjb25jYXQKZnJhbWVfZGlnIDYKaXRvYgpjb25jYXQKZnJhbWVfZGlnIDkKY29uY2F0CmZyYW1lX2J1cnkgMApmcmFtZV9kaWcgLTMKaXRvYgpib3hfZGVsCnBvcApmcmFtZV9kaWcgLTMKaXRvYgpmcmFtZV9kaWcgMApib3hfcHV0CnR4biBTZW5kZXIKZnJhbWVfZGlnIDEKPT0KYXNzZXJ0CnJldHN1YgoKLy8gZ2V0TGVuZ3RoT2ZGdW5kaW5ncwpnZXRMZW5ndGhPZkZ1bmRpbmdzXzQ6CnByb3RvIDAgMQppbnRjXzAgLy8gMApieXRlY18xIC8vICJmdW5kaW5nX2lkIgphcHBfZ2xvYmFsX2dldApmcmFtZV9idXJ5IDAKcmV0c3ViCgovLyBnZXRTcGVjaWZpY0Z1bmRpbmcKZ2V0U3BlY2lmaWNGdW5kaW5nXzU6CnByb3RvIDEgMQpieXRlY18wIC8vICIiCmZyYW1lX2RpZyAtMQppdG9iCmJveF9nZXQKc3RvcmUgMTYKc3RvcmUgMTUKbG9hZCAxNgphc3NlcnQKbG9hZCAxNQpmcmFtZV9idXJ5IDAKcmV0c3Vi";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "addFunding", desc: "", args: [{ type: "pay", name: "seed", desc: "" }, { type: "string", name: "name", desc: "" }, { type: "string", name: "description", desc: "" }, { type: "uint64", name: "amountNeeded", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "donateFunds", desc: "", args: [{ type: "pay", name: "seed", desc: "" }, { type: "uint64", name: "idx", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "editFunding", desc: "", args: [{ type: "uint64", name: "idx", desc: "" }, { type: "string", name: "name", desc: "" }, { type: "string", name: "description", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "getLengthOfFundings", desc: "", args: [], returns: { type: "uint64", desc: "" } }),
        new algosdk.ABIMethod({ name: "getSpecificFunding", desc: "", args: [{ type: "uint64", name: "idx", desc: "" }], returns: { type: "(address,string,string,uint64,uint64,uint64)", desc: "" } })
    ];
    async addFunding(args: {
        seed: algosdk.TransactionWithSigner | algosdk.Transaction;
        name: string;
        description: string;
        amountNeeded: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.addFunding({ seed: args.seed, name: args.name, description: args.description, amountNeeded: args.amountNeeded }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async donateFunds(args: {
        seed: algosdk.TransactionWithSigner | algosdk.Transaction;
        idx: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.donateFunds({ seed: args.seed, idx: args.idx }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async editFunding(args: {
        idx: bigint;
        name: string;
        description: string;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.editFunding({ idx: args.idx, name: args.name, description: args.description }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async getLengthOfFundings(txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<bigint>> {
        const result = await this.execute(await this.compose.getLengthOfFundings(txnParams));
        return new bkr.ABIResult<bigint>(result, result.returnValue as bigint);
    }
    async getSpecificFunding(args: {
        idx: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<[
        string,
        string,
        string,
        bigint,
        bigint,
        bigint
    ]>> {
        const result = await this.execute(await this.compose.getSpecificFunding({ idx: args.idx }, txnParams));
        return new bkr.ABIResult<[
            string,
            string,
            string,
            bigint,
            bigint,
            bigint
        ]>(result, result.returnValue as [
            string,
            string,
            string,
            bigint,
            bigint,
            bigint
        ]);
    }
    compose = {
        addFunding: async (args: {
            seed: algosdk.TransactionWithSigner | algosdk.Transaction;
            name: string;
            description: string;
            amountNeeded: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "addFunding"), { seed: args.seed, name: args.name, description: args.description, amountNeeded: args.amountNeeded }, txnParams, atc);
        },
        donateFunds: async (args: {
            seed: algosdk.TransactionWithSigner | algosdk.Transaction;
            idx: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "donateFunds"), { seed: args.seed, idx: args.idx }, txnParams, atc);
        },
        editFunding: async (args: {
            idx: bigint;
            name: string;
            description: string;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "editFunding"), { idx: args.idx, name: args.name, description: args.description }, txnParams, atc);
        },
        getLengthOfFundings: async (txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "getLengthOfFundings"), {}, txnParams, atc);
        },
        getSpecificFunding: async (args: {
            idx: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "getSpecificFunding"), { idx: args.idx }, txnParams, atc);
        }
    };
}
