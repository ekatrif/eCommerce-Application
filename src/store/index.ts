import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import logger from 'redux-logger';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducerDefault from '../features/Authorization/authorization-slice';
import productsReducerDefault from '../features/Products/products-slice';
import categoriesReducerDefault from '../features/Categories/categories-slice';
import detailedProductReducerDefault from '../features/DetailedProducts/detailed-products-slice';
import customerReducer from '../features/Profile/customer-slice';
import filtersReducerDefault from '../features/FiltersParameters/filters-parameters-slice';
import PaginationReducerDefault from '../features/Pagination/pagination-slice';
import SearchReducerDefault from '../features/filters/search/products-by-search-slice';
import CartReducerDefault from '../features/Cart/cart-slice';
import { createCart, getHasCart } from '../api/cart';

const persistConfig = {
  key: 'root',
  storage,
};

export const rootReducers = combineReducers({
  auth: authReducerDefault,
  products: productsReducerDefault,
  categories: categoriesReducerDefault,
  detailedProduct: detailedProductReducerDefault,
  customer: customerReducer,
  filters: filtersReducerDefault,
  pagination: PaginationReducerDefault,
  search: SearchReducerDefault,
  cart: CartReducerDefault,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

async function initializeCart(): Promise<void> {
  const accessToken = useSelector((state: IRootState) => state.auth.authData.accessToken);
  const hasCart = await getHasCart(accessToken);
  if (!hasCart) {
    await createCart(accessToken);
  }
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...(process.env.NODE_ENV !== 'production' ? [logger] : [])),
  devTools: true,
});

initializeCart();

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
