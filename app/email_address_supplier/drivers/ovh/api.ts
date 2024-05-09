import nodeOvh from 'ovh'
import { EmailAddressSupplierError } from '#email_address_supplier/errors'

const ovhAPI = nodeOvh({
  endpoint: 'ovh-eu',
  appKey: 'a23cc8d7eb22dc14',
  appSecret: '6475dd7e43057ce53b6ee6851e0dccc1',
  consumerKey: 'df3f2e744c2fba02aaaf53f578cad8fc',
  // debug: true,
})

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type OvhParams = {
  accountName?: string
  description?: string | null
  password?: string | null
}

export async function ovhRequest(
  method: Method,
  endpoint: string,
  params: OvhParams | undefined = undefined
): Promise<any> {
  return new Promise((resolve, reject) => {
    ovhAPI.request(method, endpoint, params, (error: string | number | null, res: any) => {
      if (error) {
        let errorMessage: string | undefined
        if (typeof res === 'string') {
          errorMessage = res
        } else if (typeof res?.message === 'string') {
          errorMessage = res.message
        }

        return reject(
          new EmailAddressSupplierError(
            ` OVH error code: ${error}.` +
              (errorMessage ? ` OVH error message: ${errorMessage}` : '')
          )
        )
      }

      resolve(res)
    })
  })
}

// ovhAPI.request(
//   'POST',
//   '/auth/credential',
//   {
//     accessRules: [
//       { method: 'GET', path: '/*' },
//       { method: 'POST', path: '/*' },
//       { method: 'PUT', path: '/*' },
//       { method: 'DELETE', path: '/*' },
//     ],
//   },
//   function (error, credential) {
//     console.log(error || credential)
//   }
// )
