/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Key, ReactElement, ReactNode} from 'react';

export interface ItemProps<T> {
  /** Rendered contents of the item or child items. */
  children: ReactNode,
  /** Rendered contents of the item if `children` contains child items. */
  title?: ReactNode, // label?? contents?
  /** A string representation of the item's contents, used for features like typeahead. */
  textValue?: string,
  /** An accessibility label for this item. */
  'aria-label'?: string,  
  /** 
   * Child items of this item. The function that rendered 
   * this items will be called recursively to render each one.
   * */
  childItems?: Iterable<T>,
  /** Whether this item has children, even if not loaded yet. */
  hasChildItems?: boolean,
  /** A unique key for this item. */
  uniqueKey?: Key
}

export type ItemElement<T> = ReactElement<ItemProps<T>>;
export type ItemRenderer<T> = (item: T) => ItemElement<T>;

interface AsyncLoadable<T> {
  /** Item objects in the collection or section. */
  items?: Iterable<T>,
  /** Property name on each item object to use as the unique key. `id` or `key` by default. */
  itemKey?: string,
  /** Whether the items are currently loading. */
  isLoading?: boolean, // possibly isLoadingMore
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore?: () => any
}

export interface SectionProps<T> extends AsyncLoadable<T> {
  /** Rendered contents of the section, e.g. a header. */
  title?: ReactNode,
  /** An accessibility label for the section. */
  'aria-label'?: string,
  /** Static child items or a function to render children. */
  children: ItemElement<T> | ItemElement<T>[] | ItemRenderer<T>,
  /** A unique key for the section. */
  uniqueKey?: Key
}

export type SectionElement<T> = ReactElement<SectionProps<T>>;

export type CollectionElement<T> = SectionElement<T> | ItemElement<T>;
export type CollectionChildren<T> = CollectionElement<T> | CollectionElement<T>[] | ((item: T) => CollectionElement<T>);
export interface CollectionBase<T> extends AsyncLoadable<T> {
  /** The contents of the collection. */
  children: CollectionChildren<T>,
  /** They item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>
}

export interface SingleSelection {
  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: boolean,
  /** The currently selected key in the collection (controlled). */
  selectedKey?: Key,
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: Key,
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: Key) => any
}

export type SelectionMode = 'none' | 'single' | 'multiple';
export interface MultipleSelection {
  /** The type of selection that is allowed in the collection. */
  selectionMode?: SelectionMode,
  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: boolean,
  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: Iterable<Key>,
  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: Iterable<Key>,
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: Set<Key>) => any
}

export interface Expandable {
  /** The currently expanded keys in the collection (controlled). */
  expandedKeys?: Iterable<Key>,
  /** The initial expanded keys in the collection (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>,
  /** Handler that is called when items are expanded or collapsed. */
  onExpandedChange?: (keys: Set<Key>) => any
}

export interface Sortable {
  /** The current sorted column and direction (controlled). */
  sortDescriptor?: SortDescriptor,
  /** The initial sorted column and direction (uncontrolled). */
  defaultSortDescriptor?: SortDescriptor,
  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor) => any
}

export interface SortDescriptor {
  /** The key of the column to sort by. */
  column?: Key,
  /** The direction to sort by. */
  direction?: SortDirection
}

export enum SortDirection {
  ASC,
  DESC
}

export interface KeyboardDelegate {
  /** Returns the key visually below the given one, or `null` for none. */
  getKeyBelow?(key: Key): Key,

  /** Returns the key visually above the given one, or `null` for none. */
  getKeyAbove?(key: Key): Key,

  /** Returns the key visually to the left of the given one, or `null` for none. */
  getKeyLeftOf?(key: Key): Key,

  /** Returns the key visually to the right of the given one, or `null` for none. */
  getKeyRightOf?(key: Key): Key,

  /** Returns the key visually one page below the given one, or `null` for none. */
  getKeyPageBelow?(key: Key): Key,

  /** Returns the key visually one page above the given one, or `null` for none. */
  getKeyPageAbove?(key: Key): Key,

  /** Returns the first key, or `null` for none. */
  getFirstKey?(key?: Key, global?: boolean): Key,

  /** Returns the last key, or `null` for none. */
  getLastKey?(key?: Key, global?: boolean): Key,

  /** Returns the next key after `fromKey` that matches the given search string, or `null` for none. */
  getKeyForSearch?(search: string, fromKey?: Key): Key
}

interface AsyncListOptions<T> {
  load: (state: ListState<T>) => Promise<ListState<T>>,
  loadMore?: (state: ListState<T>) => Promise<ListState<T>>,
  defaultSortDescriptor?: SortDescriptor,
  sort?: (state: ListState<T>) => Promise<ListState<T>>
}

interface ListState<T> {
  items: Iterable<T>,
  disabledKeys?: Iterable<Key>,
  selectedKeys?: Iterable<Key>,
  selectedKey?: Key,
  expandedKeys?: Iterable<Key>,
  sortDescriptor?: SortDescriptor
}

interface AsyncListProps<T> {
  items: Iterable<T>,
  isLoading: boolean,
  error?: Error,
  onLoadMore?: () => void,
  sortDescriptor?: SortDescriptor,
  onSortChange?: (desc: SortDescriptor) => void,
  disabledKeys?: Iterable<Key>,
  selectedKeys?: Iterable<Key>,
  selectedKey?: Key,
  expandedKeys?: Iterable<Key>
}

declare function useAsyncList<T>(opts: AsyncListOptions<T>): AsyncListProps<T>;
