export default async function(path, method, data) {
    const response = await fetch(`http://localhost:3000/${path}`, {
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