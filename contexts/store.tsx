'use client'

import { Cart, Store, StoreAction } from '@/lib/types'
import { Dispatch, createContext, useContext, useReducer } from 'react'

const initialStore: Store = {
  allProducts: [],
  cart: {}
}

const StoreContext = createContext<Store>(initialStore)

const StoreDispatchContext = createContext<Dispatch<StoreAction>>(() => {})

type StoreProviderProps = {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [store, dispatch] = useReducer(storeReducer, initialStore)

  return (
    <StoreContext.Provider value={store}>
      <StoreDispatchContext.Provider value={dispatch}>
        {children}
      </StoreDispatchContext.Provider>
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}

export function useStoreDispatch() {
  return useContext(StoreDispatchContext)
}

function storeReducer(store: Store, action: StoreAction) {
  switch (action.type) {
    case 'fetched_products': {
      return {
        ...store,
        allProducts: action.products
      }
    }
    case 'added_to_cart': {
      let nextCart = { ...store.cart }

      if (action.productId in nextCart) {
        nextCart[action.productId] += 1
      } else {
        nextCart[action.productId] = 1
      }

      return {
        ...store,
        cart: nextCart
      }
    }
    case 'removed_from_cart': {
      let nextCart = { ...store.cart }

      if (action.productId in nextCart && nextCart[action.productId] !== 1) {
        nextCart[action.productId] -= 1
      } else {
        delete nextCart[action.productId]
      }

      return {
        ...store,
        cart: nextCart
      }
    }
    case 'order_placed': {
      return {
        ...store,
        cart: {}
      }
    }
    default: {
      throw Error('Unknown action')
    }
  }
}
