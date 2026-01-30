export interface LeadershipMember {
    id: number;
    name: string;
    position: string;
    bio: string;
    shortDescription: string;
    details: string;
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
            shortDescription: 'Strategic visionary with 35+ years in corporate governance.',
            bio: 'Distinguished business leader with over 35 years of experience in strategic governance and corporate development.',
            details: 'Dr. Arjuna Wickramasinghe has been a pivotal figure in the corporate world for over three decades. His expertise spans across multiple industries, including finance, healthcare, and infrastructure. As the Chairman, he provides strategic direction and oversight, ensuring that the company adheres to the highest standards of corporate governance. His leadership has been instrumental in guiding the organization through transformative growth phases and navigating complex market dynamics.',
            image: '/leadership/board-chairman.png',
            linkedin: 'https://linkedin.com',
            email: 'chairman@oceanlk.com',
            department: 'Board'
        },
        {
            id: 2,
            name: 'Nalini Ratnayake',
            position: 'Vice Chairperson',
            shortDescription: 'Financial oversight expert and strategic planner.',
            bio: 'Expert in corporate governance with extensive experience in financial oversight and strategic planning.',
            details: 'Nalini Ratnayake brings a wealth of experience in financial management and strategic planning. She has served on the boards of several leading corporations and is known for her rigorous approach to financial oversight. Her role as Vice Chairperson involves working closely with the Board to formulate long-term strategies and ensure financial sustainability. She is a strong advocate for transparency and accountability in corporate reporting.',
            image: '/leadership/board-vice.png',
            linkedin: 'https://linkedin.com',
            email: 'vice.chair@oceanlk.com',
            department: 'Board'
        },
        {
            id: 3,
            name: 'Rohan De Silva',
            position: 'Independent Director',
            shortDescription: 'Independent voice for unbiased strategic guidance.',
            bio: 'Seasoned executive bringing independent oversight and strategic guidance to the organization.',
            details: 'Rohan De Silva acts as an independent voice on the Board, bringing an unbiased perspective to strategic discussions. With a background in law and international business, he contributes significantly to risk management and compliance strategies. His role is crucial in safeguarding the interests of all stakeholders, ensuring that decision-making processes are balanced and objective.',
            image: '/leadership/board-independent.png',
            linkedin: 'https://linkedin.com',
            email: 'independent@oceanlk.com',
            department: 'Board'
        },
        {
            id: 4,
            name: 'Chaminda Jayasuriya',
            position: 'Non-Executive Director',
            shortDescription: 'Guardian of stakeholder interests and corporate values.',
            bio: 'Provides strategic direction and ensures alignment with stakeholder interests and corporate values.',
            details: 'Chaminda Jayasuriya focuses on aligning the company’s operations with its core values and the interests of its diverse stakeholders. As a Non-Executive Director, he provides objective feedback on performance and helps shape the company’s corporate social responsibility initiatives. His deep understanding of market trends and consumer behavior is invaluable in guiding the company’s strategic direction.',
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
            shortDescription: 'Innovation driver with a track record in business expansion.',
            bio: 'Visionary leader driving innovation and growth across all business units with proven track record in expansion.',
            details: 'Rajesh Fernando drives the company’s vision and operational strategy. With a strong background in technology and management, he has successfully led the company through several phases of rapid expansion. His leadership style fosters a culture of innovation and agility, empowering teams to explore new ideas and deliver exceptional value to customers.',
            image: '/leadership/ceo.png',
            linkedin: 'https://linkedin.com',
            email: 'ceo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 6,
            name: 'Priya Jayawardena',
            position: 'Chief Financial Officer',
            shortDescription: '20+ years in corporate finance and risk management.',
            bio: 'Expert in corporate finance, strategic planning, and risk management with over 20 years of experience.',
            details: 'Priya Jayawardena oversees the financial health of the organization. Her expertise in capital allocation, financial planning, and risk management ensures the company maintains a strong balance sheet while investing in growth opportunities. She plays a key role in investor relations and financial reporting.',
            image: '/leadership/cfo.png',
            linkedin: 'https://linkedin.com',
            email: 'cfo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 7,
            name: 'Michael De Silva',
            position: 'Chief Operating Officer',
            shortDescription: 'Operations specialist focusing on process optimization.',
            bio: 'Driving operational excellence and process optimization across all divisions of the organization.',
            details: 'Michael De Silva is responsible for the day-to-day operations of the company. He focuses on optimizing processes, improving efficiency, and ensuring operational excellence across all divisions. His hands-on approach and focus on data-driven decision making have resulted in significant productivity gains.',
            image: '/leadership/coo.png',
            linkedin: 'https://linkedin.com',
            email: 'coo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 8,
            name: 'Samantha Perera',
            position: 'Chief Strategy Officer',
            shortDescription: 'Growth strategist identifying new market opportunities.',
            bio: 'Architecting the future growth strategy and identifying new market opportunities for sustainable expansion.',
            details: 'Samantha Perera leads the strategic planning function, identifying new market opportunities and partnerships. She works closely with the CEO and Board to define the company’s long-term roadmap. Her ability to anticipate market shifts and adapt strategies accordingly is a key asset to the organization.',
            image: '/leadership/cso.png',
            linkedin: 'https://linkedin.com',
            email: 'cso@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 9,
            name: 'Anil Kumar',
            position: 'Chief Technology Officer',
            shortDescription: 'Tech innovator leading digital transformation.',
            bio: 'Leading digital transformation initiatives and technology innovation across the holding company.',
            details: 'Anil Kumar heads the technology division, driving digital transformation and innovation. He oversees the development of proprietary technologies and ensures the company stays at the forefront of technological advancements. His leadership is critical in maintaining the company’s competitive edge in the digital age.',
            image: '/leadership/cto.png',
            linkedin: 'https://linkedin.com',
            email: 'cto@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 10,
            name: 'Kavitha Mendis',
            position: 'Chief Human Resources Officer',
            shortDescription: 'HR leader building world-class teams and culture.',
            bio: 'Building world-class teams and fostering a culture of excellence, innovation, and employee engagement.',
            details: 'Kavitha Mendis champions the company’s most valuable asset: its people. She leads HR strategies focused on talent acquisition, development, and retention. Her efforts in building a positive and inclusive workplace culture have been recognized industry-wide.',
            image: '/leadership/chro.png',
            linkedin: 'https://linkedin.com',
            email: 'chro@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 11,
            name: 'Dinesh Amarasinghe',
            position: 'Chief Legal Officer',
            shortDescription: 'Legal expert ensuring compliance and governance.',
            bio: 'Ensuring legal compliance and providing strategic counsel on corporate governance and regulatory matters.',
            details: 'Dinesh Amarasinghe provides legal counsel to the executive team and Board. He ensures that all business operations comply with relevant laws and regulations. His expertise in corporate law and negotiation is vital in managing legal risks and structuring complex business deals.',
            image: '/leadership/clo.png',
            linkedin: 'https://linkedin.com',
            email: 'clo@oceanlk.com',
            department: 'Executive'
        },
        {
            id: 12,
            name: 'Sharmila Gunasekara',
            position: 'Chief Marketing Officer',
            shortDescription: 'Brand strategist driving marketing excellence.',
            bio: 'Driving brand strategy and marketing excellence across all portfolio companies and business units.',
            details: 'Sharmila Gunasekara leads the marketing and brand strategy. She is responsible for building a strong brand presence and driving customer engagement. Her innovative marketing campaigns have significantly increased brand awareness and market share.',
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
            shortDescription: 'Business leader driving partnerships and growth.',
            bio: 'Leading strategic partnerships and new business initiatives to drive growth and market expansion.',
            details: 'Nuwan Bandara focuses on expanding the company’s footprint through strategic partnerships and new business initiatives. He identifies and cultivates relationships with key clients and partners, driving revenue growth and market penetration.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'vp.bizdev@oceanlk.com',
            department: 'Management'
        },
        {
            id: 14,
            name: 'Lakshmi Wijesinghe',
            position: 'VP of Operations',
            shortDescription: 'Operations expert ensuring process efficiency.',
            bio: 'Overseeing day-to-day operations and ensuring efficiency across all business processes.',
            details: 'Lakshmi Wijesinghe manages the operational aspects of the business, ensuring smooth and efficient workflows. She works closely with department heads to optimize processes and solve operational challenges.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'vp.ops@oceanlk.com',
            department: 'Management'
        },
        {
            id: 15,
            name: 'Kasun Rodrigo',
            position: 'VP of Corporate Affairs',
            shortDescription: 'Communications pro managing corporate reputation.',
            bio: 'Managing stakeholder relations and corporate communications to enhance organizational reputation.',
            details: 'Kasun Rodrigo manages the company’s corporate communications and stakeholder relations. He is responsible for maintaining a positive public image and ensuring effective communication with internal and external audiences.',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'vp.corporate@oceanlk.com',
            department: 'Management'
        },
        {
            id: 16,
            name: 'Nadeeka Silva',
            position: 'Director of Innovation',
            shortDescription: 'Innovation leader fostering creativity.',
            bio: 'Driving innovation initiatives and fostering a culture of continuous improvement and creativity.',
            details: 'Nadeeka Silva leads the innovation lab, exploring new technologies and business models. She champions a culture of creativity and experimentation, encouraging employees to think outside the box and develop novel solutions.',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop&crop=faces',
            linkedin: 'https://linkedin.com',
            email: 'dir.innovation@oceanlk.com',
            department: 'Management'
        }
    ]
};
