import { NextPage } from 'next'
import { useState } from 'react'
import { SearchProps } from '@/libs/interface/props'
import { matchAddress } from '@/utils/matchAddress'
import { ToastMessage } from '@/components/Toast'

const Search: NextPage<SearchProps> = ({ handleSearch }) => {
    const [address, setAddress] = useState('')
    const [showToastMessage, setShowToastMessage] = useState(false)

    const handleSearchAddress = async () => {
        const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(
            address
        )}`
        const response = await fetch(url)
        const getData = await response.json()

        if (Array.isArray(getData) && getData.length > 0) {
            const searchResult = matchAddress(address, getData)
            if (searchResult.length != 0) {
                handleSearch(address, searchResult[1], searchResult[0])
            } else {
                setShowToastMessage(true)
            }
        } else {
            setShowToastMessage(true)
        }
    }

    return (
        <div className="relative max-w-xs">
            {showToastMessage && (
                <div className="z-10">
                    <ToastMessage
                        setshowToastMessage={setShowToastMessage}
                        message={'Invalid address.'}
                        shouldReload={false}
                    />
                </div>
            )}
            <label htmlFor="hs-table-search" className="sr-only">
                Search Address
            </label>
            <input
                type="text"
                name="hs-table-search"
                id="hs-table-search"
                className="p-3 pl-10 block w-full border border-gray-200 text-sm text-gray-800 rounded-md outline-none ring-indigo-300 transition duration-100 focus-visible:ring"
                placeholder="Search Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="off"
            />
            <div
                className="absolute inset-y-0 left-0 flex items-center pl-4"
                onClick={handleSearchAddress}
            >
                <svg
                    className="h-3.5 w-3.5 text-black hover:text-indigo-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
            </div>
        </div>
    )
}

export default Search
