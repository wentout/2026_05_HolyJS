'use strict';

import { define } from 'mnemonica';

// Data types (use 'type', not 'interface' for data structures)
export type SlideView = 'MDX' | 'Title' | 'Title2' | 'Starter';

export type SlideData = {
	view: SlideView;
	data: string;
	settings?: Record<string, unknown>;
	title?: string;
	subtitle?: string;
	author?: string;
};

// Raw data type for List constructor
export type rawListData = {
	items: string[];
	currentIndex: number;
};

// Raw data type for Slide constructor
export type rawSlideData = {
	view: string;
	data: string;
	settings: Record<string, unknown>;
};

/**
 * List - Container for all slides
 * 
 * The List instance becomes a factory for Slide instances
 * via instance-level inheritance (nested constructors)
 */
export const List = define('List', function (
	this: rawListData,
	items: string[]
) {
	this.items = items;
	this.currentIndex = 0;
});

/**
 * Slide - Nested type on List instances
 * 
 * Usage: new listInstance.Slide(data)
 * This is the mnemonica data flow pattern!
 */
export const Slide = List.define('Slide', function (
	this: rawSlideData,
	data: SlideData
) {
	this.view = data.view;
	this.data = data.data;
	this.settings = data.settings || {};
	debugger;
});

// Export instance types AFTER definitions
export type ListInstance = InstanceType<typeof List>;
export type SlideInstance = InstanceType<typeof Slide>;

export default List;
