export const oceanData = {
    company: {
        name: "Ocean Ceylon Holdings",
        tagline: "Depth of Vision. Horizons of Growth.",
        heroDescription: "From the heart of Sri Lanka to the global stage. We are a diversified powerhouse driving sustainable innovation across marine, logistics, and leisure sectors.",
        ctaPrimary: "Explore Our World",
        ctaSecondary: "Watch Showreel"
    },
    navigation: [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "Corporate",
            hasDropdown: true,
            subItems: [
                { name: "Profile", path: "/corporate/profile" },
                { name: "Leadership", path: "/corporate/leadership" }
            ]
        },
        {
            name: "Companies",
            hasDropdown: true,
            subItems: [
                { name: "All Companies", path: "/companies" },
                { name: "Ocean Maritime Ceylon", path: "/companies/omc", logo: "/company logos/Ocean Maritime Ceylon logo.png" },
                { name: "TRD", path: "/companies/trd", logo: "/company logos/TRD Logo.png" },
                { name: "Ocean Engineering Ceylon", path: "/companies/oec", logo: "/company logos/Ocean engineering ceylon.png" },
                { name: "Ocean Maritime Channel", path: "/companies/omch", logo: "/company logos/ocean maritime channel.png" },
                { name: "Connecting Cubes", path: "/companies/connecting-cubes", logo: "/company logos/connecting cubes logo..png" },
                { name: "Digital Books", path: "/companies/digital-books", logo: "/company logos/digital books.png" }
            ]
        },
        {
            name: "News",
            hasDropdown: true,
            subItems: [
                { name: "Blogs", path: "/news/blogs" },
                { name: "News", path: "/news/articles" },
                { name: "Media", path: "/news/media" }
            ]
        },
        {
            name: "Life at OCH",
            hasDropdown: true,
            subItems: [
                { name: "Culture", path: "/careers/culture" },
                { name: "Onboard", path: "/careers/opportunities" },
                { name: "Talent Pool", path: "/careers/talent-pool" }
            ]
        },
        {
            name: "Contact Us",
            path: "/contact"
        }
    ],
    stats: [
        { id: 1, label: "Years of Excellence", value: "35+" },
        { id: 2, label: "Subsidiaries", value: "12" },
        { id: 3, label: "Global Partners", value: "50+" }
    ],
    sectors: [
        {
            id: "omc",
            title: "Ocean Maritime Ceylon",
            desc: "Takes orders and delivers supplies for ships in operation side.",
            longDescription: "Ocean Maritime Ceylon is a premier maritime service provider spanning the major ports of Sri Lanka. We specialize in the operational aspect of ship supply, taking orders and ensuring the seamless delivery of essential provisions, spare parts, and technical supplies to vessels in operation. Our 24/7 service ensures that ships face zero downtime due to supply chain delays.",
            logo: "/company logos/Ocean Maritime Ceylon logo.png",
            image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2000&auto=format&fit=crop",
            video: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
            founded: "1998",
            employees: "150+",
            revenue: "$45M",
            category: "Maritime Operations",
            stats: [
                { label: "Vessels Served", value: "500+", icon: "Ship" },
                { label: "Ports", value: "4", icon: "Anchor" },
                { label: "Deliveries", value: "10k+", icon: "Package" }
            ]
        },
        {
            id: "trd",
            title: "TRD",
            desc: "An investment company focusing on strategic growth and opportunities.",
            longDescription: "TRD is the strategic investment arm of Ocean Ceylon Holdings. we identify high-potential business opportunities and foster economic growth through targeted investments and partnerships. Our portfolio spans across various sectors, ensuring diversified growth and long-term sustainability for our stakeholders.",
            logo: "/company logos/TRD Logo.png",
            image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2000&auto=format&fit=crop",
            founded: "2010",
            employees: "50+",
            revenue: "$120M",
            category: "Investment & Finance",
            stats: [
                { label: "Assets Under Mgmt", value: "$200M+", icon: "Briefcase" },
                { label: "Portfolio Co.", value: "12", icon: "PieChart" },
                { label: "Annual Growth", value: "15%", icon: "TrendingUp" }
            ]
        },
        {
            id: "oec",
            title: "Ocean Engineering Ceylon",
            desc: "The engineering company which completes the engineering requests of the company.",
            longDescription: "Ocean Engineering Ceylon serves as the technical backbone of our marine operations. We handle all engineering requests, from routine maintenance to complex structural repairs and modifications. Our team of expert marine engineers ensures that every vessel operates at peak performance and meets all safety and compliance rigor.",
            logo: "/company logos/Ocean engineering ceylon.png",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop",
            video: "https://videos.pexels.com/video-files/2043509/2043509-uhd_2560_1440_25fps.mp4",
            founded: "2005",
            employees: "200+",
            revenue: "$60M",
            category: "Marine Engineering",
            stats: [
                { label: "Projects Completed", value: "1k+", icon: "Wrench" },
                { label: "Engineers", value: "80+", icon: "Users" },
                { label: "Success Rate", value: "99.9%", icon: "CheckCircle" }
            ]
        },
        {
            id: "omch",
            title: "Ocean Maritime Channel",
            desc: "Does the supply side, handling logistics and channel management.",
            longDescription: "Ocean Maritime Channel focuses on the broader supply side of the maritime industry. We manage the complex logistics channels that keep the maritime world moving. From sourcing global products to managing port-to-port logistics chains, we ensure the steady flow of goods required for maritime operations.",
            logo: "/company logos/ocean maritime channel.png",
            image: "https://images.unsplash.com/photo-1494412574643-35d3d4706f6e?q=80&w=2000&auto=format&fit=crop",
            founded: "2012",
            employees: "120+",
            revenue: "$40M",
            category: "Logistics & Supply",
            stats: [
                { label: "Global Partners", value: "150+", icon: "Globe" },
                { label: "Supply Routes", value: "25", icon: "Map" },
                { label: "Efficiency", value: "98%", icon: "Activity" }
            ]
        },
        {
            id: "connecting-cubes",
            title: "Connecting Cubes",
            desc: "A traveling agency creating personalized travel experiences.",
            longDescription: "Connecting Cubes is your gateway to the world. As a premier travel agency, we specialize in curating personalized travel experiences that go beyond the ordinary. Whether it's corporate travel management, luxury vacations, or adventure tours, we connect the 'cubes' of your journey to create a seamless picture.",
            logo: "/company logos/connecting cubes logo..png",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
            video: "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4",
            founded: "2015",
            employees: "40+",
            revenue: "$15M",
            category: "Travel & Tourism",
            stats: [
                { label: "Destinations", value: "50+", icon: "MapPin" },
                { label: "Happy Travelers", value: "5k+", icon: "Smile" },
                { label: "Tours", value: "200+", icon: "Compass" }
            ]
        },
        {
            id: "digital-books",
            title: "Digital Books",
            desc: "A digital marketing company driving brand visibility.",
            longDescription: "Digital Books is a forward-thinking digital marketing agency. We help brands tell their stories in the digital age. From social media management and SEO to comprehensive digital campaigns and content creation, we provide the tools and strategies needed to stand out in a crowded digital marketplace.",
            logo: "/company logos/digital books.png",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
            founded: "2018",
            employees: "35+",
            revenue: "$10M",
            category: "Digital Marketing",
            stats: [
                { label: "Campaigns", value: "300+", icon: "Layout" },
                { label: "ROI Avg", value: "300%", icon: "BarChart" },
                { label: "Clients", value: "80+", icon: "Users" }
            ]
        }
    ],
    gallery: [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop",
            video: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
            title: "Maritime Excellence",
            category: "OMC"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop",
            title: "Digital Innovation",
            category: "TRD"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop",
            video: "https://videos.pexels.com/video-files/2043509/2043509-uhd_2560_1440_25fps.mp4",
            title: "Engineering Solutions",
            category: "OEC"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop",
            title: "Logistics Network",
            category: "OMCH"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop",
            video: "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4",
            title: "Connecting People",
            category: "Connecting Cubes"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
            title: "Digital Knowledge",
            category: "Digital Books"
        }
    ],
    instagramUpdates: [
        {
            id: 1,
            companyId: "omc",
            companyName: "Ocean Maritime Ceylon",
            companyLogo: "/company logos/Ocean Maritime Ceylon logo.png",
            image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2000&auto=format&fit=crop",
            caption: "Successfully facilitated the berthing of MV Ocean Explorer at Colombo Port. Our 24/7 ship agency services ensure seamless operations.",
            likes: 342,
            date: "2026-01-14",
            size: "large"
        },
        {
            id: 2,
            companyId: "trd",
            companyName: "TRD",
            companyLogo: "/company logos/TRD Logo.png",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
            caption: "Excited to announce our latest strategic partnership in digital transformation. Driving growth through innovation.",
            likes: 256,
            date: "2026-01-13",
            size: "medium"
        },
        {
            id: 3,
            companyId: "oec",
            companyName: "Ocean Engineering Ceylon",
            companyLogo: "/company logos/Ocean engineering ceylon.png",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop",
            caption: "Our team completed major hull repairs on a 50,000 DWT bulk carrier. Excellence in marine engineering.",
            likes: 189,
            date: "2026-01-12",
            size: "medium"
        },
        {
            id: 4,
            companyId: "omch",
            companyName: "Ocean Maritime Channel",
            companyLogo: "/company logos/ocean maritime channel.png",
            image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000&auto=format&fit=crop",
            caption: "Expanding our port logistics network across Sri Lanka's major harbors. Comprehensive maritime solutions at your service.",
            likes: 412,
            date: "2026-01-15",
            size: "large"
        },
        {
            id: 5,
            companyId: "connecting-cubes",
            companyName: "Connecting Cubes",
            companyLogo: "/company logos/connecting cubes logo..png",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
            caption: "Curating unforgettable experiences across Sri Lanka's scenic landscapes. Your journey, our passion.",
            likes: 523,
            date: "2026-01-11",
            size: "medium"
        },
        {
            id: 6,
            companyId: "digital-books",
            companyName: "Digital Books",
            companyLogo: "/company logos/digital books.png",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
            caption: "New arrivals: 500+ eBooks added to our library this month. Read unlimited in Sinhala, Tamil & English.",
            likes: 298,
            date: "2026-01-10",
            size: "small"
        },
        {
            id: 7,
            companyId: "omc",
            companyName: "Ocean Maritime Ceylon",
            companyLogo: "/company logos/Ocean Maritime Ceylon logo.png",
            image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2000&auto=format&fit=crop",
            caption: "Crew change operations completed efficiently. Ensuring seafarer welfare and compliance with international standards.",
            likes: 167,
            date: "2026-01-09",
            size: "small"
        }
    ],
    testimonials: [
        {
            id: 1,
            name: "John Anderson",
            position: "CEO, Global Shipping Inc.",
            company: "Global Shipping Inc.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
            quote: "Ocean Ceylon Holdings has been instrumental in transforming our maritime operations. Their innovative approach and commitment to excellence sets them apart in the industry.",
            rating: 5
        },
        {
            id: 2,
            name: "Sarah Mitchell",
            position: "Director of Operations, TechVentures",
            company: "TechVentures",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
            quote: "Working with OceanLK Tech has accelerated our digital transformation journey. Their expertise and dedication to our success is truly remarkable.",
            rating: 5
        },
        {
            id: 3,
            name: "Michael Chen",
            position: "Managing Partner, Strategic Investments",
            company: "Strategic Investments",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            quote: "OceanLK Capital's strategic insights and investment acumen have delivered exceptional returns. They are true partners in growth and innovation.",
            rating: 5
        },
        {
            id: 4,
            name: "Emily Roberts",
            position: "VP Sustainability, EcoGlobal",
            company: "EcoGlobal",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
            quote: "The renewable energy solutions from OceanLK Energy have not only reduced our carbon footprint but also created long-term value for our organization.",
            rating: 5
        }
    ]
};

