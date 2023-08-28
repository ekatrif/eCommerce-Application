import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { fetchProducts } from './products-slice';
import { IRootState } from '../types';
import classes from './Products.module.scss';
import ProductCard from './ProductCard/ProductCard';

interface IProductsProps {
  categoryId?: string;
}

const Products: React.FC<IProductsProps> = ({ categoryId }) => {
  const products = useSelector((state: IRootState) => state.products.productsData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  return (
    <>
      {products.isLoading && <div>Loading...</div>}
      {!products.isLoading && products.error ? <div>{products.error}</div> : null}
      {!products.isLoading && products.results.length && !categoryId ? (
        <ul className={classes.list}>
          {products.results.map((result) => (
            <ProductCard product={result} key={result.id} />
          ))}
        </ul>
      ) : null}
      {categoryId ? (
        <ul className={classes.list}>
          {products.results
            .filter((result) => result.masterData.current.categories[0]?.id === categoryId)
            .map((result) => (
              <ProductCard product={result} key={result.id} />
            ))}
        </ul>
      ) : null}
    </>
  );
};

export default Products;
