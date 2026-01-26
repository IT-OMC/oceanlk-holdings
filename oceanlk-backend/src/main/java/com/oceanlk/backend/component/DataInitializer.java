package com.oceanlk.backend.component;

import com.oceanlk.backend.model.*;
import com.oceanlk.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private CompanyRepository companyRepository;

        @Autowired
        private TestimonialRepository testimonialRepository;
        @Autowired
        private AdminUserRepository adminUserRepository;
        @Autowired
        private JobOpportunityRepository jobOpportunityRepository;
        @Autowired
        private MediaItemRepository mediaItemRepository;
        @Autowired
        private PartnerRepository partnerRepository;
        @Autowired
        private CorporateLeaderRepository corporateLeaderRepository;
        @Autowired
        private GlobalMetricRepository globalMetricRepository;

        @Override
        public void run(String... args) throws Exception {
                seedCompanies();

                seedTestimonials();
                seedAdminUser();
                seedJobOpportunities();
                seedMediaItems();
                seedPartners();
                seedCorporateLeaders();
                seedGlobalMetrics();
        }

        private void seedPartners() {
                if (partnerRepository.count() == 0) {
                        List<Partner> partners = new ArrayList<>();
                        partners.add(new Partner("World Shipping Council", "/partner_logos/partner1.png",
                                        "https://www.worldshipping.org"));
                        partners.add(new Partner("Int. Chamber of Shipping", "/partner_logos/partner2.png",
                                        "https://www.ics-shipping.org"));
                        partners.add(new Partner("BIMCO Member", "/partner_logos/partner3.png",
                                        "https://www.bimco.org"));
                        partners.add(new Partner("Marine Environment Pro.", "/partner_logos/partner4.png",
                                        "https://www.mepc.org"));
                        partnerRepository.saveAll(partners);
                        System.out.println("Seeded Partners");
                }
        }

        private void seedCorporateLeaders() {
                if (corporateLeaderRepository.count() == 0) {
                        List<CorporateLeader> leaders = new ArrayList<>();

                        // Board
                        leaders.add(new CorporateLeader(
                                        "Dr. Sarah Perera", "Chairperson", "BOARD",
                                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
                                        "Dr. Perera brings over 25 years of maritime law and policy experience...",
                                        "Strategic Visionary"));

                        leaders.add(new CorporateLeader(
                                        "Mr. David Alwis", "Non-Executive Director", "BOARD",
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
                                        "A veteran in global logistics and supply chain management...",
                                        "Governance Expert"));

                        // Executive
                        leaders.add(new CorporateLeader(
                                        "James Fernando", "Chief Executive Officer", "EXECUTIVE",
                                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
                                        "James has led OceanLK through its most transformative years...",
                                        "Operational Excellence"));

                        leaders.add(new CorporateLeader(
                                        "Mrs. Kamala Silva", "Chief Financial Officer", "EXECUTIVE",
                                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
                                        "Expert in maritime finance and international taxation...",
                                        "Financial Steward"));

                        // Senior
                        leaders.add(new CorporateLeader(
                                        "Mr. Rajan Selvam", "Head of Engineering", "SENIOR",
                                        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
                                        "Overseeing our technical fleet and engineering projects...",
                                        "Technical Lead"));

                        corporateLeaderRepository.saveAll(leaders);
                        System.out.println("Seeded Corporate Leaders");
                }
        }

        private void seedGlobalMetrics() {
                if (globalMetricRepository.count() == 0) {
                        List<GlobalMetric> metrics = new ArrayList<>();
                        // Icon names must match frontend mapping: Ship, Calendar, Anchor, MapPin, Globe
                        metrics.add(new GlobalMetric("Active Routes", "15+", "Ship", 1));
                        metrics.add(new GlobalMetric("Weekly Sailings", "113", "Calendar", 2));
                        metrics.add(new GlobalMetric("Annual Capacity", "3M", "Anchor", 3));
                        metrics.add(new GlobalMetric("Global Ports", "50+", "MapPin", 4));
                        metrics.add(new GlobalMetric("Countries Served", "25+", "Globe", 5));

                        globalMetricRepository.saveAll(metrics);
                        System.out.println("Seeded Global Metrics");
                }
        }

        private void seedAdminUser() {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                adminUserRepository.findByUsername("admin").ifPresentOrElse(
                                existingAdmin -> {
                                        if (existingAdmin.getName() == null || existingAdmin.getName().isEmpty()) {
                                                existingAdmin.setName("Admin User");
                                                existingAdmin.setVerified(true);
                                                adminUserRepository.save(existingAdmin);
                                                System.out.println(
                                                                "Updated existing admin user with name 'Admin User'");
                                        } else if (!existingAdmin.isVerified()) {
                                                existingAdmin.setVerified(true);
                                                adminUserRepository.save(existingAdmin);
                                        }
                                },
                                () -> {
                                        AdminUser admin = new AdminUser("Admin User", "admin",
                                                        encoder.encode("admin123"),
                                                        "admin@oceanlk.com",
                                                        "+94771234567", "SUPER_ADMIN");
                                        admin.setVerified(true);
                                        adminUserRepository.save(admin);
                                        System.out.println("Seeded Super Admin User (admin / admin123)");
                                });

                adminUserRepository.findByUsername("superadmin").ifPresentOrElse(
                                existingSuperAdmin -> {
                                        if (existingSuperAdmin.getName() == null
                                                        || existingSuperAdmin.getName().isEmpty()) {
                                                existingSuperAdmin.setName("Super Admin");
                                                existingSuperAdmin.setVerified(true);
                                                adminUserRepository.save(existingSuperAdmin);
                                                System.out.println(
                                                                "Updated existing superadmin user with name 'Super Admin'");
                                        } else if (!existingSuperAdmin.isVerified()) {
                                                existingSuperAdmin.setVerified(true);
                                                adminUserRepository.save(existingSuperAdmin);
                                        }
                                },
                                () -> {
                                        AdminUser superAdmin = new AdminUser("Super Admin", "superadmin",
                                                        encoder.encode("superadmin123"),
                                                        "superadmin@oceanlk.com",
                                                        "+94771234567", "SUPER_ADMIN");
                                        superAdmin.setVerified(true);
                                        adminUserRepository.save(superAdmin);
                                        System.out.println("Seeded Super Admin User (superadmin / superadmin123)");
                                });
        }

        private void seedJobOpportunities() {
                if (jobOpportunityRepository.count() == 0) {
                        List<JobOpportunity> jobs = new ArrayList<>();

                        jobs.add(new JobOpportunity("Senior Maritime Engineer", "OceanLK Marine", "Colombo, Sri Lanka",
                                        "Full-time",
                                        "Engineering",
                                        "Lead our maritime engineering team in developing innovative shipping solutions.",
                                        true, "Senior"));

                        jobs.add(new JobOpportunity("Resort Manager", "OceanLK Leisure", "Galle, Sri Lanka",
                                        "Full-time",
                                        "Hospitality", "Manage daily operations of our flagship beach resort property.",
                                        true, "Manager"));

                        jobs.add(new JobOpportunity("Renewable Energy Specialist", "OceanLK Energy",
                                        "Colombo, Sri Lanka", "Full-time",
                                        "Engineering", "Drive our solar and wind energy project implementations.",
                                        false, "Specialist"));

                        jobs.add(new JobOpportunity("Full Stack Developer", "OceanLK Tech", "Remote", "Contract",
                                        "Technology", "Build cutting-edge web applications for our enterprise clients.",
                                        true, "Mid-Senior"));

                        jobs.add(new JobOpportunity("Financial Analyst", "OceanLK Holdings", "Colombo, Sri Lanka",
                                        "Full-time",
                                        "Finance",
                                        "Provide financial analysis and strategic insights for group operations.",
                                        false, "Analyst"));

                        jobs.add(new JobOpportunity("Marketing Manager", "OceanLK Leisure", "Colombo, Sri Lanka",
                                        "Full-time",
                                        "Marketing", "Lead marketing strategies for our hospitality brands.", false,
                                        "Manager"));

                        jobOpportunityRepository.saveAll(jobs);
                        System.out.println("Seeded Job Opportunities");
                }
        }

        private void seedCompanies() {
                if (companyRepository.count() == 0) {
                        List<Company> companies = new ArrayList<>();

                        // OMC
                        Company omc = new Company();
                        omc.setId("omc");
                        omc.setTitle("Ocean Maritime Ceylon");
                        omc.setDescription("Takes orders and delivers supplies for ships in operation side.");
                        omc.setLongDescription(
                                        "Ocean Maritime Ceylon is a premier maritime service provider spanning the major ports of Sri Lanka. We specialize in the operational aspect of ship supply, taking orders and ensuring the seamless delivery of essential provisions, spare parts, and technical supplies to vessels in operation. Our 24/7 service ensures that ships face zero downtime due to supply chain delays.");
                        omc.setLogoUrl("/company logos/Ocean Maritime Ceylon logo.png");
                        omc.setImage(
                                        "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2000&auto=format&fit=crop");
                        omc.setVideo("https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4");
                        omc.setEstablished("1998");
                        omc.setEmployees("150+");
                        omc.setRevenue("$45M");
                        omc.setCategory("Maritime Operations");
                        omc.setStats(Arrays.asList(
                                        createStat("Vessels Served", "500+", "Ship"),
                                        createStat("Ports", "4", "Anchor"),
                                        createStat("Deliveries", "10k+", "Package")));
                        companies.add(omc);

                        // OEC
                        Company oec = new Company();
                        oec.setId("oec");
                        oec.setTitle("Ocean Engineering Ceylon");
                        oec.setDescription(
                                        "The engineering company which completes the engineering requests of the company.");
                        oec.setLongDescription(
                                        "Ocean Engineering Ceylon serves as the technical backbone of our marine operations. We handle all engineering requests, from routine maintenance to complex structural repairs and modifications. Our team of expert marine engineers ensures that every vessel operates at peak performance and meets all safety and compliance rigor.");
                        oec.setLogoUrl("/company logos/Ocean engineering ceylon.png");
                        oec.setImage(
                                        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop");
                        oec.setVideo("https://videos.pexels.com/video-files/2043509/2043509-uhd_2560_1440_25fps.mp4");
                        oec.setEstablished("2005");
                        oec.setEmployees("200+");
                        oec.setRevenue("$60M");
                        oec.setCategory("Marine Engineering");
                        oec.setStats(Arrays.asList(
                                        createStat("Projects Completed", "1k+", "Wrench"),
                                        createStat("Engineers", "80+", "Users"),
                                        createStat("Success Rate", "99.9%", "CheckCircle")));
                        companies.add(oec);

                        // OMCH
                        Company omch = new Company();
                        omch.setId("omch");
                        omch.setTitle("Ocean Maritime Channel");
                        omch.setDescription("Does the supply side, handling logistics and channel management.");
                        omch.setLongDescription(
                                        "Ocean Maritime Channel focuses on the broader supply side of the maritime industry. We manage the complex logistics channels that keep the maritime world moving. From sourcing global products to managing port-to-port logistics chains, we ensure the steady flow of goods required for maritime operations.");
                        omch.setLogoUrl("/company logos/ocean maritime channel.png");
                        omch.setImage(
                                        "https://images.unsplash.com/photo-1494412574643-35d3d4706f6e?q=80&w=2000&auto=format&fit=crop");
                        omch.setEstablished("2012");
                        omch.setEmployees("120+");
                        omch.setRevenue("$40M");
                        omch.setCategory("Logistics & Supply");
                        omch.setStats(Arrays.asList(
                                        createStat("Global Partners", "150+", "Globe"),
                                        createStat("Supply Routes", "25", "Map"),
                                        createStat("Efficiency", "98%", "Activity")));
                        companies.add(omch);

                        // Connecting Cubes
                        Company cc = new Company();
                        cc.setId("connecting-cubes");
                        cc.setTitle("Connecting Cubes");
                        cc.setDescription("A traveling agency creating personalized travel experiences.");
                        cc.setLongDescription(
                                        "Connecting Cubes is your gateway to the world. As a premier travel agency, we specialize in curating personalized travel experiences that go beyond the ordinary. Whether it's corporate travel management, luxury vacations, or adventure tours, we connect the 'cubes' of your journey to create a seamless picture.");
                        cc.setLogoUrl("/company logos/connecting cubes logo..png");
                        cc.setImage(
                                        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop");
                        cc.setVideo("https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4");
                        cc.setEstablished("2015");
                        cc.setEmployees("40+");
                        cc.setRevenue("$15M");
                        cc.setCategory("Travel & Tourism");
                        cc.setStats(Arrays.asList(
                                        createStat("Destinations", "50+", "MapPin"),
                                        createStat("Happy Travelers", "5k+", "Smile"),
                                        createStat("Tours", "200+", "Compass")));
                        companies.add(cc);

                        // Digital Books
                        Company db = new Company();
                        db.setId("digital-books");
                        db.setTitle("Digital Books");
                        db.setDescription("A digital marketing company driving brand visibility.");
                        db.setLongDescription(
                                        "Digital Books is a forward-thinking digital marketing agency. We help brands tell their stories in the digital age. From social media management and SEO to comprehensive digital campaigns and content creation, we provide the tools and strategies needed to stand out in a crowded digital marketplace.");
                        db.setLogoUrl("/company logos/digital books.png");
                        db.setImage(
                                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop");
                        db.setEstablished("2018");
                        db.setEmployees("35+");
                        db.setRevenue("$10M");
                        db.setCategory("Digital Marketing");
                        db.setStats(Arrays.asList(
                                        createStat("Campaigns", "300+", "Layout"),
                                        createStat("ROI Avg", "300%", "BarChart"),
                                        createStat("Clients", "80+", "Users")));
                        companies.add(db);

                        companyRepository.saveAll(companies);
                        System.out.println("Seeded Companies");
                }
        }

        private Company.Stat createStat(String label, String value, String icon) {
                Company.Stat stat = new Company.Stat();
                stat.setLabel(label);
                stat.setValue(value);
                stat.setIcon(icon);
                return stat;
        }

        private void seedTestimonials() {
                if (testimonialRepository.count() == 0) {
                        List<Testimonial> items = new ArrayList<>();

                        items.add(createTestimonial(1, "John Anderson", "CEO, Global Shipping Inc.",
                                        "Global Shipping Inc.",
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
                                        "Ocean Ceylon Holdings has been instrumental in transforming our maritime operations. Their innovative approach and commitment to excellence sets them apart in the industry.",
                                        5));

                        items.add(createTestimonial(2, "Sarah Mitchell", "Director of Operations, TechVentures",
                                        "TechVentures",
                                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
                                        "Working with OceanLK Tech has accelerated our digital transformation journey. Their expertise and dedication to our success is truly remarkable.",
                                        5));

                        items.add(createTestimonial(3, "Michael Chen", "Managing Partner, Strategic Investments",
                                        "Strategic Investments",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
                                        "OceanLK Capital's strategic insights and investment acumen have delivered exceptional returns. They are true partners in growth and innovation.",
                                        5));

                        items.add(createTestimonial(4, "Emily Roberts", "VP Sustainability, EcoGlobal", "EcoGlobal",
                                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
                                        "The renewable energy solutions from OceanLK Energy have not only reduced our carbon footprint but also created long-term value for our organization.",
                                        5));

                        testimonialRepository.saveAll(items);
                        System.out.println("Seeded Testimonials");
                }
        }

        private Testimonial createTestimonial(Integer id, String name, String position, String company, String image,
                        String quote, int rating) {
                Testimonial t = new Testimonial();
                t.setId(id);
                t.setName(name);
                t.setPosition(position);
                t.setCompany(company);
                t.setImage(image);
                t.setQuote(quote);
                t.setRating(rating);
                return t;
        }

        private void seedMediaItems() {
                if (mediaItemRepository.findByTitle("Employee Appreciation Day 2025").isEmpty()) {
                        List<MediaItem> items = new ArrayList<>();

                        // --- HR / CULTURE Categories (LIFE_AT_OCH, EVENTS, GALLERY) ---

                        // Life at OCH
                        items.add(new MediaItem(
                                        "Employee Appreciation Day 2025",
                                        "A day filled with fun, games, and recognition for our hardworking team members.",
                                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
                                        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
                                        "LIFE_AT_OCH",
                                        true));
                        items.add(new MediaItem(
                                        "Team Building in Sigiriya",
                                        "Our annual team excursion to the historic rock fortress of Sigiriya.",
                                        "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "LIFE_AT_OCH",
                                        false));

                        // Events
                        items.add(new MediaItem(
                                        "Annual Awards Night 2025",
                                        "Celebrating excellence and dedication at our grand awards ceremony.",
                                        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "EVENTS",
                                        true));
                        items.add(new MediaItem(
                                        "CSR Initiative: Coastal Cleanup",
                                        "Our team volunteering to keep our beautiful coastlines clean and plastic-free.",
                                        "https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "EVENTS",
                                        false));

                        // Gallery (General/Shared)
                        items.add(new MediaItem(
                                        "New Headquarters Opening",
                                        "Glimpses from the opening of our state-of-the-art office complex in Colombo.",
                                        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
                                        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
                                        "GALLERY",
                                        true));
                        MediaItem gallery2 = new MediaItem(
                                        "Port Operations Overview",
                                        "A visual tour of our busy port operations and logistics handling.",
                                        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "GALLERY",
                                        false);
                        // Assigning a company ID for Gallery item (e.g., OMC)
                        gallery2.setCompanyId("omc");
                        items.add(gallery2);

                        // --- GENERAL / MEDIA Categories (NEWS, BLOG, MEDIA, PRESS_RELEASE) ---

                        // NEWS
                        MediaItem news1 = new MediaItem(
                                        "OceanLK Expands Fleet with 5 New Vessels",
                                        "Strategic expansion to meet growing global demand for logistics.",
                                        "https://images.unsplash.com/photo-1559297434-fae8a1916a79?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "NEWS",
                                        true);
                        news1.setExcerpt("We are proud to announce the addition of 5 modern vessels...");
                        news1.setCompanyId("omc");
                        items.add(news1);

                        MediaItem news2 = new MediaItem(
                                        "Partnership with EcoEnergy Solutions",
                                        "Collaborating for a greener, sustainable maritime future.",
                                        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "NEWS",
                                        false);
                        news2.setExcerpt("OceanLK has signed a generic MoU with EcoEnergy...");
                        news2.setCompanyId("oec");
                        items.add(news2);

                        // BLOG
                        MediaItem blog1 = new MediaItem(
                                        "The Future of Smart Shipping",
                                        "How IoT and AI are revolutionizing the maritime industry.",
                                        "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "BLOG",
                                        true);
                        blog1.setExcerpt("Smart shipping is no longer a concept of the future...");
                        blog1.setAuthor("Dr. Aruna Perera");
                        blog1.setReadTime("5 min read");
                        items.add(blog1);

                        MediaItem blog2 = new MediaItem(
                                        "Sustainable Tourism in Sri Lanka",
                                        "Exploring the hidden gems of our island nation responsibly.",
                                        "https://images.unsplash.com/photo-1546708773-e57fa527acb0?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "BLOG",
                                        false);
                        blog2.setExcerpt("Sri Lanka offers more than just beaches...");
                        blog2.setAuthor("Sarah Shenali");
                        blog2.setReadTime("4 min read");
                        blog2.setCompanyId("connecting-cubes");
                        items.add(blog2);

                        // MEDIA (Video, Gallery, Document)
                        MediaItem mediaVideo = new MediaItem(
                                        "Corporate Overview 2025",
                                        "A journey through our milestones and vision for the future.",
                                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
                                        "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4",
                                        "MEDIA",
                                        true);
                        mediaVideo.setType("VIDEO");
                        mediaVideo.setDuration("03:45");
                        items.add(mediaVideo);

                        MediaItem mediaDoc = new MediaItem(
                                        "Annual Report 2024",
                                        "Comprehensive financial and operational report for the fiscal year.",
                                        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "MEDIA",
                                        false);
                        mediaDoc.setType("DOCUMENT");
                        mediaDoc.setPageCount(120);
                        items.add(mediaDoc);

                        MediaItem mediaPhotos = new MediaItem(
                                        "Port Development Project",
                                        "Progress photos of the new terminal construction.",
                                        "https://images.unsplash.com/photo-1590845947391-ba409895c026?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "MEDIA",
                                        false);
                        mediaPhotos.setType("GALLERY");
                        mediaPhotos.setPhotoCount(25);
                        items.add(mediaPhotos);

                        // PRESS RELEASE
                        MediaItem press1 = new MediaItem(
                                        "OceanLK Achieves ISO 9001 Certification",
                                        "Demonstrating our commitment to quality management systems.",
                                        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "PRESS_RELEASE",
                                        false);
                        items.add(press1);

                        mediaItemRepository.saveAll(items);
                        System.out.println("Seeded Media Items");
                }
        }
}
