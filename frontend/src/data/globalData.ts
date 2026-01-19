export interface ShippingRoute {
    id: string;
    name: string;
    from: {
        name: string;
        lat: number;
        lng: number;
    };
    to: {
        name: string;
        lat: number;
        lng: number;
    };
    weeklySailings: number;
    tonnageMoved: string;
    transitTime: string;
    color: string;
    importance: 'high' | 'medium' | 'low';
}

// Sri Lankan port coordinates
export const COLOMBO = {
    name: 'Colombo Port',
    lat: 6.9271,
    lng: 79.8612,
};

export const TRINCOMALEE = {
    name: 'Trincomalee Port',
    lat: 8.5874,
    lng: 81.2152,
};

export const HAMBANTOTA = {
    name: 'Hambantota Port',
    lat: 6.1247,
    lng: 81.1185,
};

// For backward compatibility
export const SRI_LANKA = COLOMBO;

export const shippingRoutes: ShippingRoute[] = [
    // From Colombo
    {
        id: 'colombo-singapore',
        name: 'Colombo → Singapore',
        from: COLOMBO,
        to: {
            name: 'Singapore',
            lat: 1.3521,
            lng: 103.8198,
        },
        weeklySailings: 28,
        tonnageMoved: '2.4M TEU',
        transitTime: '4-5 days',
        color: '#3b82f6',
        importance: 'high',
    },
    {
        id: 'colombo-dubai',
        name: 'Colombo → Dubai',
        from: COLOMBO,
        to: {
            name: 'Dubai',
            lat: 25.2048,
            lng: 55.2708,
        },
        weeklySailings: 21,
        tonnageMoved: '1.8M TEU',
        transitTime: '7-8 days',
        color: '#8b5cf6',
        importance: 'high',
    },
    {
        id: 'colombo-rotterdam',
        name: 'Colombo → Rotterdam',
        from: COLOMBO,
        to: {
            name: 'Rotterdam',
            lat: 51.9225,
            lng: 4.47917,
        },
        weeklySailings: 14,
        tonnageMoved: '1.2M TEU',
        transitTime: '18-21 days',
        color: '#ec4899',
        importance: 'high',
    },
    {
        id: 'colombo-shanghai',
        name: 'Colombo → Shanghai',
        from: COLOMBO,
        to: {
            name: 'Shanghai',
            lat: 31.2304,
            lng: 121.4737,
        },
        weeklySailings: 18,
        tonnageMoved: '1.5M TEU',
        transitTime: '12-14 days',
        color: '#10b981',
        importance: 'high',
    },
    // From Trincomalee
    {
        id: 'trinco-chennai',
        name: 'Trincomalee → Chennai',
        from: TRINCOMALEE,
        to: {
            name: 'Chennai',
            lat: 13.0827,
            lng: 80.2707,
        },
        weeklySailings: 12,
        tonnageMoved: '750K TEU',
        transitTime: '2-3 days',
        color: '#f59e0b',
        importance: 'medium',
    },
    {
        id: 'trinco-mumbai',
        name: 'Trincomalee → Mumbai',
        from: TRINCOMALEE,
        to: {
            name: 'Mumbai',
            lat: 19.0760,
            lng: 72.8777,
        },
        weeklySailings: 10,
        tonnageMoved: '680K TEU',
        transitTime: '5-6 days',
        color: '#06b6d4',
        importance: 'medium',
    },
    {
        id: 'trinco-singapore',
        name: 'Trincomalee → Singapore',
        from: TRINCOMALEE,
        to: {
            name: 'Singapore',
            lat: 1.3521,
            lng: 103.8198,
        },
        weeklySailings: 14,
        tonnageMoved: '920K TEU',
        transitTime: '4-5 days',
        color: '#14b8a6',
        importance: 'high',
    },
    // From Hambantota
    {
        id: 'hambantota-dubai',
        name: 'Hambantota → Dubai',
        from: HAMBANTOTA,
        to: {
            name: 'Dubai',
            lat: 25.2048,
            lng: 55.2708,
        },
        weeklySailings: 16,
        tonnageMoved: '1.1M TEU',
        transitTime: '6-7 days',
        color: '#a855f7',
        importance: 'high',
    },
    {
        id: 'hambantota-singapore',
        name: 'Hambantota → Singapore',
        from: HAMBANTOTA,
        to: {
            name: 'Singapore',
            lat: 1.3521,
            lng: 103.8198,
        },
        weeklySailings: 18,
        tonnageMoved: '1.3M TEU',
        transitTime: '4-5 days',
        color: '#84cc16',
        importance: 'high',
    },
    {
        id: 'hambantota-capetown',
        name: 'Hambantota → Cape Town',
        from: HAMBANTOTA,
        to: {
            name: 'Cape Town',
            lat: -33.9249,
            lng: 18.4241,
        },
        weeklySailings: 8,
        tonnageMoved: '580K TEU',
        transitTime: '12-14 days',
        color: '#ef4444',
        importance: 'medium',
    },
];

// Convert lat/lng to 3D coordinates on a sphere
export const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return { x, y, z };
};
