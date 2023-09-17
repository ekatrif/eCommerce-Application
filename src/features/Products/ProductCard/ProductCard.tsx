import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Languages } from '../../../api/types';
import formatPrice from '../../../utils/catalog/format-price';
import truncateString from '../../../utils/catalog/truncate-string';
import classes from './ProductCard.module.scss';
import Button from '../../../components/UI/button/Button';
import { ISelectedProduct } from '../types';
import { addItemToCart } from '../../../api/cart';
import { IRootState } from '../../../store';

interface IProductProps {
  product: ISelectedProduct;
  key?: string;
}

const ProductCard: React.FC<IProductProps> = ({ product }) => {
  if (!product?.name) return null;

  const dispatch = useDispatch();
  const accessToken = useSelector((state: IRootState) => state.auth.authData.accessToken);
  const cartId = useSelector((state: IRootState) => state.cart.cartData.cartId);
  const cartVer = useSelector((state: IRootState) => state.cart.cartData.actualCartVer);

  const handleAddToCart = (): void => {
    dispatch(addItemToCart(accessToken, cartId, product.id, 1, cartVer));
  };

  const handleRemoveFromCart = (): void => {
    // Write action to remove product from cart
  };

  const productsInCart = useSelector((state: IRootState) => state.cart.cartData.cartItems);
  const isProductInCart = (id: string): boolean => {
    return productsInCart.filter((item: ISelectedProduct) => item.productId === id).length > 0;
  };

  return (
    <li className={classes.item}>
      <h3>
        <a href={`catalog/${product.id}`} title={product.name[Languages.English]} className={classes.title}>
          {product.name[Languages.English]}
        </a>
      </h3>
      <div className={classes.prices}>
        {product.masterVariant.prices[0].discounted ? (
          <>
            <span className={classes.discount}>
              {formatPrice(product.masterVariant.prices[0].value.centAmount)}{' '}
              {product.masterVariant.prices[0].value.currencyCode}
            </span>
            <span className={classes.price}>
              {product.masterVariant.prices[0].discounted.value.centAmount}{' '}
              {product.masterVariant.prices[0].discounted.value.currencyCode}
            </span>
          </>
        ) : (
          <span className={classes.price}>
            {product.masterVariant.prices[0].value.centAmount} {product.masterVariant.prices[0].value.currencyCode}
          </span>
        )}
      </div>
      <a href={`catalog/${product.id}`} title={product.name[Languages.English]} className={classes.link}>
        <img
          src={product.masterVariant.images[0].url}
          alt={product.name[Languages.English]}
          className={classes.image}
        />
      </a>
      {isProductInCart(product.id) ? (
        <Button type="button" text="Remove from cart" backgroundColor="#247C52" onClick={handleRemoveFromCart} />
      ) : (
        <Button type="button" text="Add to cart" onClick={handleAddToCart} />
      )}
      <div className={classes.description}>
        <a href={`catalog/${product.id}`} title={product.name[Languages.English]} className={classes.link}>
          {truncateString(product.description[Languages.English], 200)}
        </a>
      </div>
    </li>
  );
};

export default ProductCard;
