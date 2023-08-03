import { useState } from 'react'

const Search = () => {
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [address, setAddress] = useState('')

    const handleSearch = async () => {
        const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(
            address
        )}`
        const response = await fetch(url)
        const results = await response.json()

        if (Array.isArray(results) && results.length > 0) {
            const coordinates = results[0].geometry.coordinates
            // setPosition([coordinates[1], coordinates[0]])
            console.log(coordinates)
        } else {
            alert('Not Found')
        }
    }
    return (
        <div className="relative max-w-xs">
            <label htmlFor="hs-table-search" className="sr-only">
                Search
            </label>
            <input
                type="text"
                name="hs-table-search"
                id="hs-table-search"
                className="p-3 pl-10 block w-full border border-gray-200 text-sm text-gray-800 rounded-md outline-none ring-indigo-300 transition duration-100 focus-visible:ring"
                placeholder="Search Place"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <div
                className="absolute inset-y-0 left-0 flex items-center pl-4"
                onClick={handleSearch}
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
