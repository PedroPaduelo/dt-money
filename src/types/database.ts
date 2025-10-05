/**
 * Database type definitions for IndexedDB operations
 */

// Database interface extending IDBDatabase with our store names
export interface IDBDatabase {
  objectStoreNames: DOMStringList
  version: number
  name: string
  
  createObjectStore(name: string, options?: IDBObjectStoreParameters): IDBObjectStore
  deleteObjectStore(name: string): void
  transaction(storeNames: string | string[], mode?: IDBTransactionMode): IDBTransaction
  close(): void
}

// Open request interface
export interface IDBOpenDBRequest extends IDBRequest {
  onupgradeneeded: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null
  onblocked: ((this: IDBOpenDBRequest, ev: Event) => any) | null
}

// Version change event
export interface IDBVersionChangeEvent extends Event {
  oldVersion: number
  newVersion: number | null
  target: IDBOpenDBRequest
}

// Object store interface with proper types
export interface IDBObjectStore {
  name: string
  keyPath: string | string[] | null
  autoIncrement: boolean
  indexNames: DOMStringList
  
  add(value: any, key?: any): IDBRequest
  put(value: any, key?: any): IDBRequest
  get(key: any): IDBRequest
  getAll(query?: IDBValidKey | IDBKeyRange, count?: number): IDBRequest
  delete(key: any): IDBRequest
  clear(): IDBRequest
  createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters): IDBIndex
  index(name: string): IDBIndex
}

// Index interface
export interface IDBIndex {
  name: string
  keyPath: string | string[]
  multiEntry: boolean
  unique: boolean
  
  get(key: any): IDBRequest
  getAll(query?: IDBValidKey | IDBKeyRange, count?: number): IDBRequest
  openCursor(range?: IDBKeyRange, direction?: IDBCursorDirection): IDBRequest
  openKeyCursor(range?: IDBKeyRange, direction?: IDBCursorDirection): IDBRequest
  count(query?: IDBValidKey | IDBKeyRange): IDBRequest
}

// Transaction interface
export interface IDBTransaction extends EventTarget {
  db: IDBDatabase
  mode: IDBTransactionMode
  error: DOMException | null
  
  objectStore(name: string): IDBObjectStore
  abort(): void
  commit(): void
}

// Database configuration
export interface DatabaseConfig {
  name: string
  version: number
  stores: StoreConfig[]
}

export interface StoreConfig {
  name: string
  keyPath: string | string[]
  autoIncrement?: boolean
  indexes?: IndexConfig[]
}

export interface IndexConfig {
  name: string
  keyPath: string | string[]
  options?: {
    unique?: boolean
    multiEntry?: boolean
  }
}

// Database status
export interface DatabaseStatus {
  isReady: boolean
  version: number
  stores: string[]
}

// Database error types
export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class DatabaseNotInitializedError extends DatabaseError {
  constructor() {
    super('Database not initialized')
    this.name = 'DatabaseNotInitializedError'
  }
}

export class TransactionError extends DatabaseError {
  constructor(message: string, public transaction: IDBTransaction) {
    super(message)
    this.name = 'TransactionError'
  }
}

// Database initialization result
export interface DatabaseInitResult {
  success: boolean
  version: number
  stores: string[]
  error?: string
}