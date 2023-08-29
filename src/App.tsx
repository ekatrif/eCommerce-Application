import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Grid } from 'react-loader-spinner';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import GuestRoute from './components/Routing/GuestRoute';
import PrivateRoute from './components/Routing/PrivateRoute';
import { store } from './store';

const Header = lazy(() => import('./components/Header/Header'));
const MainPage = lazy(() => import('./pages/MainPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Footer = lazy(() => import('./components/Footer/Footer'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

const App: React.FC = () => {
  const persistor = persistStore(store);
  return (
    <Router>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Header />
          <Suspense
            fallback={
              <Grid
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="spinner"
                visible={true}
              />
            }
          >
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/categories/:categoryId" element={<CategoryPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/registration"
                element={
                  <GuestRoute>
                    <RegistrationPage />
                  </GuestRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/shopping-cart"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
          <Footer />
        </PersistGate>
      </Provider>
    </Router>
  );
};

export default App;
