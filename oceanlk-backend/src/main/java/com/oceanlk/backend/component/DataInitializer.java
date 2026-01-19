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
        private NewsUpdateRepository newsUpdateRepository;
        @Autowired
        private GalleryItemRepository galleryItemRepository;
        @Autowired
        private TestimonialRepository testimonialRepository;
        @Autowired
        private AdminUserRepository adminUserRepository;
        @Autowired
        private JobOpportunityRepository jobOpportunityRepository;

        @Override
        public void run(String... args) throws Exception {
                seedCompanies();
                seedNewsUpdates();
                seedGalleryItems();
                seedTestimonials();
                seedAdminUser();
                seedJobOpportunities();
        }

        private void seedAdminUser() {
                if (adminUserRepository.count() == 0) {
                        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                        AdminUser admin = new AdminUser("admin", encoder.encode("admin123"), "ADMIN");
                        adminUserRepository.save(admin);
                        System.out.println("Seeded Admin User");
                }
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
                        omc.setDesc("Takes orders and delivers supplies for ships in operation side.");
                        omc.setLongDescription(
                                        "Ocean Maritime Ceylon is a premier maritime service provider spanning the major ports of Sri Lanka. We specialize in the operational aspect of ship supply, taking orders and ensuring the seamless delivery of essential provisions, spare parts, and technical supplies to vessels in operation. Our 24/7 service ensures that ships face zero downtime due to supply chain delays.");
                        omc.setLogo("/company logos/Ocean Maritime Ceylon logo.png");
                        omc.setImage(
                                        "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2000&auto=format&fit=crop");
                        omc.setVideo("https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4");
                        omc.setFounded("1998");
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
                        oec.setDesc("The engineering company which completes the engineering requests of the company.");
                        oec.setLongDescription(
                                        "Ocean Engineering Ceylon serves as the technical backbone of our marine operations. We handle all engineering requests, from routine maintenance to complex structural repairs and modifications. Our team of expert marine engineers ensures that every vessel operates at peak performance and meets all safety and compliance rigor.");
                        oec.setLogo("/company logos/Ocean engineering ceylon.png");
                        oec.setImage(
                                        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop");
                        oec.setVideo("https://videos.pexels.com/video-files/2043509/2043509-uhd_2560_1440_25fps.mp4");
                        oec.setFounded("2005");
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
                        omch.setDesc("Does the supply side, handling logistics and channel management.");
                        omch.setLongDescription(
                                        "Ocean Maritime Channel focuses on the broader supply side of the maritime industry. We manage the complex logistics channels that keep the maritime world moving. From sourcing global products to managing port-to-port logistics chains, we ensure the steady flow of goods required for maritime operations.");
                        omch.setLogo("/company logos/ocean maritime channel.png");
                        omch.setImage(
                                        "https://images.unsplash.com/photo-1494412574643-35d3d4706f6e?q=80&w=2000&auto=format&fit=crop");
                        omch.setFounded("2012");
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
                        cc.setDesc("A traveling agency creating personalized travel experiences.");
                        cc.setLongDescription(
                                        "Connecting Cubes is your gateway to the world. As a premier travel agency, we specialize in curating personalized travel experiences that go beyond the ordinary. Whether it's corporate travel management, luxury vacations, or adventure tours, we connect the 'cubes' of your journey to create a seamless picture.");
                        cc.setLogo("/company logos/connecting cubes logo..png");
                        cc.setImage(
                                        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop");
                        cc.setVideo("https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4");
                        cc.setFounded("2015");
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
                        db.setDesc("A digital marketing company driving brand visibility.");
                        db.setLongDescription(
                                        "Digital Books is a forward-thinking digital marketing agency. We help brands tell their stories in the digital age. From social media management and SEO to comprehensive digital campaigns and content creation, we provide the tools and strategies needed to stand out in a crowded digital marketplace.");
                        db.setLogo("/company logos/digital books.png");
                        db.setImage(
                                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop");
                        db.setFounded("2018");
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

        private void seedNewsUpdates() {
                if (newsUpdateRepository.count() == 0) {
                        List<NewsUpdate> updates = new ArrayList<>();

                        // 1. OMC (Large)
                        NewsUpdate u1 = new NewsUpdate();
                        u1.setId(1);
                        u1.setCompanyId("omc");
                        u1.setCompanyName("Ocean Maritime Ceylon");
                        u1.setCompanyLogo("/company logos/Ocean Maritime Ceylon logo.png");
                        u1.setImage(
                                        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2000&auto=format&fit=crop");
                        u1.setCaption(
                                        "Successfully facilitated the berthing of MV Ocean Explorer at Colombo Port. Our 24/7 ship agency services ensure seamless operations.");
                        u1.setLikes(342);
                        u1.setDate("2026-01-14");
                        u1.setSize("large");
                        updates.add(u1);

                        // 3. OEC (Medium)
                        NewsUpdate u3 = new NewsUpdate();
                        u3.setId(3);
                        u3.setCompanyId("oec");
                        u3.setCompanyName("Ocean Engineering Ceylon");
                        u3.setCompanyLogo("/company logos/Ocean engineering ceylon.png");
                        u3.setImage(
                                        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop");
                        u3.setCaption(
                                        "Our team completed major hull repairs on a 50,000 DWT bulk carrier. Excellence in marine engineering.");
                        u3.setLikes(189);
                        u3.setDate("2026-01-12");
                        u3.setSize("medium");
                        updates.add(u3);

                        // 5. Connecting Cubes (Medium)
                        NewsUpdate u5 = new NewsUpdate();
                        u5.setId(5);
                        u5.setCompanyId("connecting-cubes");
                        u5.setCompanyName("Connecting Cubes");
                        u5.setCompanyLogo("/company logos/connecting cubes logo..png");
                        u5.setImage(
                                        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop");
                        u5.setCaption(
                                        "Curating unforgettable experiences across Sri Lanka's scenic landscapes. Your journey, our passion.");
                        u5.setLikes(523);
                        u5.setDate("2026-01-11");
                        u5.setSize("medium");
                        updates.add(u5);

                        // 4. OMCH (Large)
                        NewsUpdate u4 = new NewsUpdate();
                        u4.setId(4);
                        u4.setCompanyId("omch");
                        u4.setCompanyName("Ocean Maritime Channel");
                        u4.setCompanyLogo("/company logos/ocean maritime channel.png");
                        u4.setImage(
                                        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000&auto=format&fit=crop");
                        u4.setCaption(
                                        "Expanding our port logistics network across Sri Lanka's major harbors. Comprehensive maritime solutions at your service.");
                        u4.setLikes(412);
                        u4.setDate("2026-01-15");
                        u4.setSize("large");
                        updates.add(u4);

                        // 6. Digital Books (Medium)
                        NewsUpdate u6 = new NewsUpdate();
                        u6.setId(6);
                        u6.setCompanyId("digital-books");
                        u6.setCompanyName("Digital Books");
                        u6.setCompanyLogo("/company logos/digital books.png");
                        u6.setImage(
                                        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop");
                        u6.setCaption(
                                        "New arrivals: 500+ eBooks added to our library this month. Read unlimited in Sinhala, Tamil & English.");
                        u6.setLikes(298);
                        u6.setDate("2026-01-10");
                        u6.setSize("medium");
                        updates.add(u6);

                        // 7. OMC (Medium)
                        NewsUpdate u7 = new NewsUpdate();
                        u7.setId(7);
                        u7.setCompanyId("omc");
                        u7.setCompanyName("Ocean Maritime Ceylon");
                        u7.setCompanyLogo("/company logos/Ocean Maritime Ceylon logo.png");
                        u7.setImage(
                                        "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2000&auto=format&fit=crop");
                        u7.setCaption(
                                        "Crew change operations completed efficiently. Ensuring seafarer welfare and compliance with international standards.");
                        u7.setLikes(167);
                        u7.setDate("2026-01-09");
                        u7.setSize("medium");
                        updates.add(u7);

                        newsUpdateRepository.saveAll(updates);
                        System.out.println("Seeded News Updates");
                }
        }

        private void seedGalleryItems() {
                if (galleryItemRepository.count() == 0) {
                        List<GalleryItem> items = new ArrayList<>();

                        items.add(createGalleryItem(1,
                                        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop",
                                        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
                                        "Maritime Excellence", "OMC"));

                        // Skipped TRD as it was removed

                        items.add(createGalleryItem(3,
                                        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop",
                                        "https://videos.pexels.com/video-files/2043509/2043509-uhd_2560_1440_25fps.mp4",
                                        "Engineering Solutions", "OEC"));

                        items.add(createGalleryItem(4,
                                        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop",
                                        null,
                                        "Logistics Network", "OMCH"));

                        items.add(createGalleryItem(5,
                                        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop",
                                        "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4",
                                        "Connecting People",
                                        "Connecting Cubes"));

                        items.add(createGalleryItem(6,
                                        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
                                        null, "Digital Knowledge", "Digital Books"));

                        galleryItemRepository.saveAll(items);
                        System.out.println("Seeded Gallery Items");
                }
        }

        private GalleryItem createGalleryItem(Integer id, String image, String video, String title, String category) {
                GalleryItem item = new GalleryItem();
                item.setId(id);
                item.setImage(image);
                item.setVideo(video);
                item.setTitle(title);
                item.setCategory(category);
                return item;
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
}
