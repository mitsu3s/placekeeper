const forHash = (placename: string) => {
    return placename.replace(/\s/g, '_')
}

export default forHash
