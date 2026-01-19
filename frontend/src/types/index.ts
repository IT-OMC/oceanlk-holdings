import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface NavLink {
    label: string;
    href: string;
}

export interface StatCard {
    icon: LucideIcon;
    value: string;
    label: string;
    description: string;
}

export interface Sector {
    id: string;
    title: string;
    description: string;
    image: string;
    size: 'small' | 'medium' | 'large';
}

export interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    id?: string;
}
