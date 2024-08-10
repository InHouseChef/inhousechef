export interface Phone {
    telephone: string
}

export interface PhoneRequest extends Phone {}
export interface PhoneResponse extends Phone {}

export interface Address {
    street: string
    city: string
}

export interface AddressResponse extends Address {}
export interface AddressRequest extends Address {}
