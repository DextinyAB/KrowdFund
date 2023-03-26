import { useState } from "react";


interface toggleProps {
    addFunding: (name: string, description: string, amountNeeded: bigint) => void;
    toggleModal: () => void;
    modalStatus: boolean;
}

export default function Modals({addFunding, toggleModal, modalStatus}: toggleProps) {
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [amountNeeded, setAmountNeeded] = useState<bigint>(0n)

    async function handleSubmit(): Promise<void>{
        
        await addFunding(name, description, amountNeeded)
        toggleModal()
    }

    const modal = modalStatus ? (
        <>

        <div id="authentication-modal" aria-hidden="true" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <div className="relative w-full h-full max-w-md md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            
            <div className="px-6 py-6 lg:px-8">
                <form className="space-y-6" action="#">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name: </label>
                        <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="KrowdFund Name" required onChange={(e) => {setName(e.target.value)}}/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description: </label>
                        <input type="text" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="KrowdFund description" required onChange={(e) => {setDescription(e.target.value)}}/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount: </label>
                        <input type="number" name="amountNeeded" id="amountNeeded" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Amount Needed in Algo" required onChange={(e) => {setAmountNeeded(e.target.value as unknown as bigint)}}/>
                    </div>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                <span className="sr-only" onClick={toggleModal}>Close modal</span>
            </button>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}>Submit</button>
                </form>
            </div>
        </div>
    </div>
</div> 
</>

    ) : ("")

    return (
        <>
        {modal}
        </>
   )
}