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
    ]
};

