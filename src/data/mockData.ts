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
            name: "Companies",
            hasDropdown: true,
            subItems: [
                { name: "All Companies", path: "/companies" },
                { name: "OceanLK Marine", path: "/companies/ocean-marine" },
                { name: "OceanLK Leisure", path: "/companies/ocean-leisure" },
                { name: "OceanLK Energy", path: "/companies/ocean-energy" },
                { name: "OceanLK Tech", path: "/companies/ocean-tech" },
                { name: "OceanLK Capital", path: "/companies/ocean-capital" }
            ]
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
            name: "News",
            hasDropdown: true,
            subItems: [
                { name: "Blogs", path: "/news/blogs" },
                { name: "News", path: "/news/articles" },
                { name: "Media", path: "/news/media" }
            ]
        },
        {
            name: "Careers",
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
            id: "marine",
            title: "OceanLK Marine",
            desc: "Global maritime logistics & shipping solutions.",
            image: "/marine-hero.png"
        },
        {
            id: "leisure",
            title: "OceanLK Leisure",
            desc: "Premium hospitality & island experiences.",
            image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop"
        },
        {
            id: "energy",
            title: "OceanLK Energy",
            desc: "Sustainable renewable energy initiatives.",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2000&auto=format&fit=crop"
        },
        {
            id: "tech",
            title: "OceanLK Tech",
            desc: "Digital transformation & innovation.",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
        },
        {
            id: "capital",
            title: "OceanLK Capital",
            desc: "Strategic investments & financial growth.",
            image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2000&auto=format&fit=crop"
        }
    ],
    gallery: [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop",
            title: "Corporate Excellence",
            category: "Leadership"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop",
            title: "Team Collaboration",
            category: "Culture"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop",
            title: "Innovation Hub",
            category: "Technology"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop",
            title: "Strategic Planning",
            category: "Business"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop",
            title: "Global Operations",
            category: "Operations"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop",
            title: "Industry Leaders",
            category: "Leadership"
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

