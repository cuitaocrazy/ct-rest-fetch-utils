import fetch, { Request, RequestInit } from 'node-fetch'
export class FetchError extends Error {
  constructor(public status: number, public errMsg: string, public url: string | Request, public init?: RequestInit) {
    super(`request error: status:[${status}] retContent:[${errMsg}] url:[${url}]` + (init ? ` init: [${JSON.stringify(init)}]` : ''))
  }
}

type FetchResType = 'json' | 'text' | 'void'

const myFetch = async (url: string | Request, init: RequestInit | undefined, returnType: FetchResType) => {
  const res = await fetch(url, init)
  if (res.ok) {
    if (returnType === 'void') {
      return
    } else {
      return await res[returnType]()
    }
  } else if (res.status === 404) {
    return null
  } else {
    throw new FetchError(res.status, await res.text(), url, init)
  }
}

export const postFetch = async (url: string, data: any, returnType: FetchResType = 'json') => {
  return myFetch(url, { method: 'post', body: data && JSON.stringify(data), headers: { 'content-type': 'application/json' } }, returnType)
}

export const putFetch = (url: string, data: any) => {
  return myFetch(url, { method: 'put', body: data && JSON.stringify(data), headers: { 'content-type': 'application/json' } }, 'void')
}

export const patchFetch = (url: string, data: any) => {
  return myFetch(url, { method: 'patch', body: data && JSON.stringify(data), headers: { 'content-type': 'application/json' } }, 'void')
}

export const deleteFetch = (url: string) => {
  return myFetch(url, { method: 'delete' }, 'void')
}

export const getFetch = (url: string, returnType: FetchResType = 'json') => {
  return myFetch(url, { method: 'get' }, returnType)
}
