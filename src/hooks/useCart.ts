// This file previously contained JSX and caused TypeScript parsing errors when
// both `useCart.ts` and `useCart.tsx` existed. To avoid ambiguity, re-export
// the implementations from the .tsx module which holds the actual logic.

export { CartProvider, useCart } from './useCart.tsx'

