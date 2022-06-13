export default async function(path: string, method: string, data: Object|undefined) {
    const response = await fetch(`http://localhost:3000/api${path}`, { // http://localhost:3000
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Corss-Origin': '*'
        },
        ...data && {body: JSON.stringify(data)}
    })
    if(!response.ok)
        throw response
    return await response.json() 
  }