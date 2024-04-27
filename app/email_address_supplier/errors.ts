export class EmailAddressDoesntExistError extends Error {
  constructor(
    readonly emailAddress: string,
    readonly supplier: string
  ) {
    super(`The email "${emailAddress}" doesn't exist on the supplier "${supplier}"`)
  }
}

export class EmailAddressAlreadyExistError extends Error {
  constructor(
    readonly emailAddress: string,
    readonly supplier: string
  ) {
    super(`The email "${emailAddress}" already exist on the supplier "${supplier}"`)
  }
}

export class EmailAddressProviderError extends Error {}
