export const serverError = {
    statusCode: 301,
    headers: {
        Location: "/login?error=servererror"
    }
}

export const unauthorised = {
    statusCode: 301,
    headers: {
        Location: "/login?error=noaccess"
    }
}