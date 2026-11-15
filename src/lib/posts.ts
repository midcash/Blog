import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Note = CollectionEntry<'note'>;

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function byDateDesc(a: Post | Note, b: Post | Note): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function toDateAttribute(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getPostPath(id: string, collection: 'blog' | 'note' = 'blog'): string {
  const encodedId = id.split('/').map(encodeURIComponent).join('/');
  return `/${collection}/${encodedId}/`;
}
