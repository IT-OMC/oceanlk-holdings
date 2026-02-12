import { NavLink, StatCard, Sector } from '../types';
import { Building2, TrendingUp, Users } from 'lucide-react';

export const navLinks: NavLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Sectors', href: '#sectors' },
    { label: 'Contact', href: '#contact' },
];

export const stats: StatCard[] = [
    {
        icon: Building2,
        value: '23+',
        label: 'Portfolio Companies',
        description: 'Strategic investments across diverse sectors',
    },
    {
        icon: TrendingUp,
        value: '$4.2B',
        label: 'Assets Under Management',
        description: 'Managed with precision and expertise',
    },
    {
        icon: Users,
        value: '12K+',
        label: 'Global Workforce',
        description: 'Talented professionals worldwide',
    },
];

export const sectors: Sector[] = [
    {
        id: '1',
        title: 'Maritime & Logistics',
        description: 'Global shipping and supply chain solutions',
        image: '/sectors/maritime.jpg',
        size: 'large',
    },
    {
        id: '2',
        title: 'Renewable Energy',
        description: 'Sustainable power generation and distribution',
        image: '/sectors/energy.jpg',
        size: 'medium',
    },
    {
        id: '3',
        title: 'Technology & Innovation',
        description: 'Cutting-edge tech solutions and R&D',
        image: '/sectors/tech.jpg',
        size: 'medium',
    },
    {
        id: '4',
        title: 'Real Estate',
        description: 'Premium commercial and residential developments',
        image: '/sectors/realestate.jpg',
        size: 'small',
    },
    {
        id: '5',
        title: 'Healthcare',
        description: 'Advanced medical facilities and services',
        image: '/sectors/healthcare.jpg',
        size: 'small',
    },
];
