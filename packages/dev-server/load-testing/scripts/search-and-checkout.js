// @ts-check
import {sleep} from 'k6';
import {ShopApiRequest} from '../utils/api-request.js';

const searchQuery = new ShopApiRequest('shop/search.graphql');
const productQuery = new ShopApiRequest('shop/product.graphql');
const addItemToOrderMutation = new ShopApiRequest('shop/add-to-order.graphql');

export let options = {
  stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 75 },
      { duration: '1m', target: 150 },
      { duration: '1m', target: 0 },
  ],
};

/**
 * Searches for products, adds to order, checks out.
 */
export default function() {
  const itemsToAdd = Math.ceil(Math.random() * 10);

  for (let i = 0; i < itemsToAdd; i ++) {
    searchProducts();
    const product = findAndLoadProduct();
    addToCart(randomItem(product.variants).id);
  }
}

function searchProducts() {
  for (let i = 0; i < 4; i++) {
    searchQuery.post();
    sleep(Math.random() * 3 + 0.5);
  }
}

function findAndLoadProduct() {
  const searchResult = searchQuery.post();
  const items = searchResult.data.search.items;
  const productResult = productQuery.post({ id: randomItem(items).productId });
  return productResult.data.product;
}

function addToCart(variantId) {
  const qty = Math.ceil(Math.random() * 4);
  addItemToOrderMutation.post({ id: variantId, qty });
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
