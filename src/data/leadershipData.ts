export interface LeadershipMember {
    id: number;
    name: string;
    position: string;
    bio: string;
    image: string;
    linkedin?: string;
    email?: string;
    department?: string;
}

export interface LeadershipData {
    boardOfDirectors: LeadershipMember[];
    executiveLeadership: LeadershipMember[];
    seniorManagement: LeadershipMember[];
}

export const leadershipData: LeadershipData = {
    boardOfDirectors: [
        {
            id: 1,
            name: 'Dr. Arjuna Wickramasinghe',
            position: 'Chairman of the Board',
            bio: 'Distinguished business leader with over 35 years of experience in strategic governance and corporate development.',
            image: '/leadership/board-chairman.png',
            linkedin: 'https://linkedin.com',
            email: 'chairman@oceanlk.com',
            department: 'Board'
        },
        {
            id: 2,
            name: 'Nalini Ratnayake',
            position: 'Vice Chairperson',
            bio: 'Expert in corporate governance with extensive experience in financial oversight and strategic planning.',
            image: '/leadership/board-vice.png',
            linkedin: 'https://linkedin.com',
            email: 'vice.chair@oceanlk.com',
            department: 'Board'
        },
        {
            id: 3,
            name: 'Rohan De Silva',
            position: 'Independent Director',
            bio: 'Seasoned executive bringing independent oversight and strategic guidance to the organization.',
            image: '/leadership/board-independent.png',
            linkedin: 'https://linkedin.com',
            email: 'independent@oceanlk.com',
            department: 'Board'
        },
        {
            id: 4,
            name: 'Chaminda Jayasuriya',
            position: 'Non-Executive Director',
            bio: 'Provides strategic direction and ensures alignment with stakeholder interests and corporate values.',
            image: '/leadership/board-nonexec.png',
            linkedin: 'https://linkedin.com',
            email: 'nonexec@oceanlk.com',
            department: 'Board'
        }
    ],
    executiveLeadership: [
        {
            id: 5,
            name: 'Rajesh Fernando',
            position: 'Chief Executive Officer',
            bio: 'Visionary leader driving innovation and growth across all business units with proven track record in expansion.',
            image: '/leadership/ceo.png',
            linkedin: 'https://linkedin.com',
            email: 'ceo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 6,
            name: 'Priya Jayawardena',
            position: 'Chief Financial Officer',
            bio: 'Expert in corporate finance, strategic planning, and risk management with over 20 years of experience.',
            image: '/leadership/cfo.png',
            linkedin: 'https://linkedin.com',
            email: 'cfo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 7,
            name: 'Michael De Silva',
            position: 'Chief Operating Officer',
            bio: 'Driving operational excellence and process optimization across all divisions of the organization.',
            image: '/leadership/coo.png',
            linkedin: 'https://linkedin.com',
            email: 'coo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 8,
            name: 'Samantha Perera',
            position: 'Chief Strategy Officer',
            bio: 'Architecting the future growth strategy and identifying new market opportunities for sustainable expansion.',
            image: '/leadership/cso.png',
            linkedin: 'https://linkedin.com',
            email: 'cso@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 9,
            name: 'Anil Kumar',
            position: 'Chief Technology Officer',
            bio: 'Leading digital transformation initiatives and technology innovation across the holding company.',
            image: '/leadership/cto.png',
            linkedin: 'https://linkedin.com',
            email: 'cto@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 10,
            name: 'Kavitha Mendis',
            position: 'Chief Human Resources Officer',
            bio: 'Building world-class teams and fostering a culture of excellence, innovation, and employee engagement.',
            image: '/leadership/chro.png',
            linkedin: 'https://linkedin.com',
            email: 'chro@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 11,
            name: 'Dinesh Amarasinghe',
            position: 'Chief Legal Officer',
            bio: 'Ensuring legal compliance and providing strategic counsel on corporate governance and regulatory matters.',
            image: '/leadership/clo.png',
            linkedin: 'https://linkedin.com',
            email: 'clo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 12,
            name: 'Sharmila Gunasekara',
            position: 'Chief Marketing Officer',
            bio: 'Driving brand strategy and marketing excellence across all portfolio companies and business units.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'cmo@oceanlk.com',
            department: 'Executive'
        }
    ],
    seniorManagement: [
        {
            id: 13,
            name: 'Nuwan Bandara',
            position: 'VP of Business Development',
            bio: 'Leading strategic partnerships and new business initiatives to drive growth and market expansion.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'vp.bizdev@oceanlk.com',
            department: 'Management'
        },
        {
            id: 14,
            name: 'Lakshmi Wijesinghe',
            position: 'VP of Operations',
            bio: 'Overseeing day-to-day operations and ensuring efficiency across all business processes.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'vp.ops@oceanlk.com',
            department: 'Management'
        },
        {
            id: 15,
            name: 'Kasun Rodrigo',
            position: 'VP of Corporate Affairs',
            bio: 'Managing stakeholder relations and corporate communications to enhance organizational reputation.',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'vp.corporate@oceanlk.com',
            department: 'Management'
        },
        {
            id: 16,
            name: 'Nadeeka Silva',
            position: 'Director of Innovation',
            bio: 'Driving innovation initiatives and fostering a culture of continuous improvement and creativity.',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'dir.innovation@oceanlk.com',
            department: 'Management'
        }
    ]
};
