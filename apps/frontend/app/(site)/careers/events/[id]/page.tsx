import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import EventSingle, { type Event } from '@/views/careers/EventSingle';

export const revalidate = 3600;

function mapEvent(data: any): Event {
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time || undefined,
        location: data.location || 'OceanLK Premises',
        imageUrl: data.imageUrl,
        category: data.category || 'SOCIAL',
        status: data.status || 'UPCOMING',
    };
}

async function getEvent(id: string): Promise<Event | null> {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.EVENT_BY_ID(id), { next: { revalidate: 3600 } });
    if (res.ok) {
        return mapEvent(await res.json());
    }

    // Fallback: search all events, matching the original client behavior.
    const allRes = await fetch(NEXT_PUBLIC_API_BASE_URL.EVENTS, { next: { revalidate: 3600 } });
    if (!allRes.ok) throw new Error(`Events fetch failed: ${allRes.status}`);
    const all = await allRes.json();
    const found = all.find((item: any) => item.id === id);
    return found ? mapEvent(found) : null;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await props.params;
    const event = await getEvent(id);
    if (!event) return { title: 'Event Not Found' };
    return {
        title: event.title,
        description: event.description.slice(0, 160),
        openGraph: { title: event.title, images: event.imageUrl ? [event.imageUrl] : [] },
    };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const event = await getEvent(id);
    if (!event) notFound();
    return <EventSingle event={event} />;
}
