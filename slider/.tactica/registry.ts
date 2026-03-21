// Generated TypeRegistry for type-safe mnemonica.lookupTyped<TypeRegistry>()
// Import this interface and use with lookupTyped from mnemonica
//
// Usage:
//   import { lookupTyped } from 'mnemonica';
//   import { TypeRegistry } from './.tactica/registry';
//   const Sentience = lookupTyped<TypeRegistry>('Sentience');
//   // TypeScript knows: Sentience is a constructor for SentienceInstance
//   const instance = new Sentience({ purpose: 'AI' });
//   // instance has full intellisense for Consciousness, Memory, etc.

import type {
	List,
	List_Slide,
} from './types';

/**
 * Type registry augmenting mnemonica's TypeRegistry interface
 * This enables type-safe lookupTyped() without explicit type arguments
 *
 * Usage: const SomeType = lookupTyped('SomeType'); // Fully typed!
 */
declare module 'mnemonica' {
	interface TypeRegistry {
		'List': new (items: Array<string>) => List;
		'List.Slide': new (data: { view: 'MDX' | 'Title' | 'Title2' | 'Starter'; data: string; settings?: Record<string, unknown>; title?: string; subtitle?: string; author?: string }) => List_Slide;
	}
}

import type { TypeRegistry } from 'mnemonica';
export type { TypeRegistry };