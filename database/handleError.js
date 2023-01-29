
function handleSequelizeError(err) {
    const errors = err.errors
    const errorList = errors.map(e => {
        let obj = {}
        obj[e] = e.message
        return obj;
    })

    return errorList.map(e => e.message)
}

module.export = handleSequelizeError 