//const backend: string = (import.meta.env.DEV) ? 'http://localhost:3000' : 'production'
export default async function (
  path: string,
  method: string,
  data: Object | undefined
) {
  const response = await fetch(`/api${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(import.meta.env.DEV && { "Cors-Origin": "*" }),
    },
    ...(data && { body: JSON.stringify(data) }),
  })
  return await response.json()
}
