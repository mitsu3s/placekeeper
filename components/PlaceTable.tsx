const PlaceTable = ({ places, formatPlaceNameForHash, handlePlaceClick }: any) => {
    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto mx-4">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="border rounded-lg divide-y divide-gray-200">
                        <div className="py-3 px-4">
                            <div className="relative max-w-xs">
                                <label htmlFor="hs-table-search" className="sr-only">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    name="hs-table-search"
                                    id="hs-table-search"
                                    className="p-3 pl-10 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                                    placeholder="Search htmlFor items"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                                    <svg
                                        className="h-3.5 w-3.5 text-gray-400"
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
                        </div>
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3 px-4 pr-0">
                                            <div className="flex items-center h-5"></div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Place Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 ">
                                    {places &&
                                        places.length > 0 &&
                                        places.map((place: any, index: any) => (
                                            <tr key={index}>
                                                <td className="py-3 pl-4">
                                                    <div className="flex items-center h-5">
                                                        {places.length > 1 && (
                                                            <input
                                                                id={`hs-table-search-checkbox-${index}`}
                                                                type="checkbox"
                                                                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                                                            />
                                                        )}
                                                        <label
                                                            htmlFor="hs-table-search-checkbox-1"
                                                            className="sr-only"
                                                        >
                                                            Checkbox
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                    <a
                                                        href={`/#${formatPlaceNameForHash(
                                                            place.name
                                                        )}`}
                                                        onClick={(event) => {
                                                            event.preventDefault()
                                                            handlePlaceClick(
                                                                place.name,
                                                                place.latitude,
                                                                place.longitude
                                                            )
                                                        }}
                                                    >
                                                        {place.name}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a
                                                        className="text-blue-500 hover:text-blue-700"
                                                        href="#"
                                                    >
                                                        Delete
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceTable
