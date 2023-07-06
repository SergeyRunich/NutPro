import {
  LANGUAGE_CS,
  LANGUAGE_EN,
  SEX_MALE,
  SEX_FEMALE,
  USER_ROLE_ADMIN,
  USER_ROLE_FINANCE,
  USER_ROLE_OPERATOR,
  USER_ROLE_PRODUCTION,
  USER_ROLE_READONLY_SEARCH,
  USER_ROLE_ROOT,
  USER_ROLE_SALES,
  USER_ROLE_SALES_DIRECTOR,
  USER_ROLE_TRAINER,
} from './constants'

export interface IKitchen {
  id: number
  name: string
  email: string
}

/**
 * reversed from SystemUserSchema
 */
export interface ISystemUser {
  direction: string
  isActive: boolean
  isNextLogout: boolean
  passwordHash: string
  role: VALID_USER_ROLES
  username: string
}

interface IRawDataset {
  age: number
  BMI: number
  BMR: number
  height: number
  PBF: number
  sex: VALID_SEX
  TBW: number
  VFA: number
  weight: number
}

/**
 * reversed from DataSetSchema
 */
export interface IDataSet {
  processedData: Object
  timestamp: number
  user: IUser
  rawData: {
    age: number
    weight: number
    height: number
    sex: string
    BMR: number
    BMI: number
    PBF: number
    VFA: number
    TBW: number
    muscle: number
    speed: string
  }
}

export interface IUserPaymentData {
  address: string
  companyName: string
  isCompany: boolean
  regNumber: number
  vatNumber: string
  zip: number
}

/**
 * reversed from UserSchema
 */
export interface IUser {
  address: string
  affiliateId: string
  birthday: Date | null
  bitrixId: number
  comment: string
  creditBalance: number
  datasets: IDataSet[]
  deleted: boolean
  demoOrder: boolean
  email: string
  inBodyId: boolean
  isIgnoreInRating: boolean
  isNotCzech: boolean
  kitchen: string
  language: VALID_LANGUAGES
  name: string
  owners: ISystemUser[]
  passwordHash: string
  phone: string
  showWizard: boolean
  subjectId: string
  tag: string
  paymentData: IUserPaymentData
}

export type VALID_SEX = typeof SEX_MALE | typeof SEX_FEMALE

export type VALID_USER_ROLES =
  | typeof USER_ROLE_ROOT
  | typeof USER_ROLE_ADMIN
  | typeof USER_ROLE_SALES
  | typeof USER_ROLE_SALES_DIRECTOR
  | typeof USER_ROLE_FINANCE
  | typeof USER_ROLE_TRAINER
  | typeof USER_ROLE_OPERATOR
  | typeof USER_ROLE_PRODUCTION
  | typeof USER_ROLE_READONLY_SEARCH

export type VALID_LANGUAGES = typeof LANGUAGE_CS | typeof LANGUAGE_EN
export type TUnixTimestamp = number
export type TMongoObjectId = number | string
export type TDateTimeIsoString = string

/**
 * Response of /admin/user/:id is an array of these objects:
 */
export interface IUserGet {
  id: TMongoObjectId
  inBodyId: string
  name: string
  lastDataSet:
    | {
        status: 'Available'
        id: TMongoObjectId
        data: IRawDataset
        timestamp: TUnixTimestamp
      }
    | {
        status: 'Unavailable'
      }
  dataSets:
    | {
        status: 'Available'
        result: {
          id: TMongoObjectId
          data: IRawDataset
          timestamp: TUnixTimestamp
        }[]
      }
    | {
        status: 'Unavailable'
      }
  tag: string
  language: VALID_LANGUAGES
  demoOrder: any // todo: define type!
  address: string
  email: string
  phone: string
  bitrixId: string // todo: or number?
  kitchen: TMongoObjectId | string // user.kitchen
  activeOrder:
    | {
        status: 'Active'
        id: TMongoObjectId // order._id
      }
    | {
        status: 'Inactive'
      }
  isIgnoreInRating: boolean
  currentKitchen: {
    id: TMongoObjectId
    name: string
    timestamp: TUnixTimestamp
    start: TUnixTimestamp
  }
  kitchenHistory:
    | {
        id: TMongoObjectId // kitchen._id
        timestamp: TUnixTimestamp
        start: TUnixTimestamp
        end: TUnixTimestamp
        kitchen: {
          id: TMongoObjectId // kitchen.kitchen._id
          name: string // kitchen.kitchen.name
        }
      }[]
    | {
        status: 'Unavailable'
      }
  deleted: boolean
  isNotCzech: boolean
  sales: string
  paymentData: IUserPaymentData
  birthday: TDateTimeIsoString
  creditBalance: number
}

/**
 * reversed from KitchenHistoryUserSchema
 */
export interface IKitchenHistoryUser {
  timestamp: number
  user: IUser
  kitchen: IKitchen
  start: number
  end: number
}
