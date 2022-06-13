export default async function(path, method, data) {
    const response = await fetch(`/${path}`, { // http://localhost:3000
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        ...data && {body: JSON.stringify(data)}
    })
    if(!response.ok)
        throw response
    return await response.json() 
  }