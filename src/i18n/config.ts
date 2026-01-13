import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            nav: {
                home: 'Home',
                companies: 'Companies',
                corporate: 'Corporate',
                news: 'News',
                careers: 'Careers',
                contact: 'Contact Us',
                allCompanies: 'All Companies',
                profile: 'Profile',
                leadership: 'Leadership',
                blogs: 'Blogs',
                articles: 'News',
                media: 'Media',
                culture: 'Culture',
                onboard: 'Onboard',
                talentPool: 'Talent Pool'
            },
            // Hero Section
            hero: {
                exploreButton: 'Explore Division'
            },
            // Global Connections
            globalConnections: {
                title: 'Connecting Sri Lanka',
                subtitle: 'To The World',
                description: 'Strategic location at the crossroads of global trade routes. Explore our shipping network spanning across continents and oceans.',
                dragHint: 'Drag',
                scrollHint: 'Scroll',
                dragText: 'to rotate',
                scrollText: 'to zoom',
                weeklySailings: 'Weekly Sailings',
                tonnageMoved: 'Tonnage Moved',
                transitTime: 'Transit Time',
                activeRoutes: 'Active Routes',
                annualTonnage: 'Annual Tonnage',
                globalPorts: 'Global Ports'
            },
            // Gallery
            gallery: {
                title: 'Our',
                titleAccent: 'Journey',
                description: 'A glimpse into our world of innovation, collaboration, and excellence',
                seeMore: 'See More',
                showLess: 'Show Less'
            },
            // Testimonials
            testimonials: {
                title: 'Client',
                titleAccent: 'Testimonials',
                description: 'Success stories from our valued partners around the globe'
            },
            // Footer
            footer: {
                quickLinks: 'Quick Links',
                contact: 'Contact',
                allRightsReserved: 'All rights reserved',
                privacyPolicy: 'Privacy Policy',
                termsOfService: 'Terms of Service'
            }
        }
    },
    si: {
        translation: {
            // Navigation
            nav: {
                home: 'මුල් පිටුව',
                companies: 'සමාගම්',
                corporate: 'ව්‍යාපාරික',
                news: 'පුවත්',
                careers: 'රැකියා',
                contact: 'අප අමතන්න',
                allCompanies: 'සියලුම සමාගම්',
                profile: 'පැතිකඩ',
                leadership: 'නායකත්වය',
                blogs: 'බ්ලොග්',
                articles: 'පුවත්',
                media: 'මාධ්‍ය',
                culture: 'සංස්කෘතිය',
                onboard: 'එක්වන්න',
                talentPool: 'දක්ෂ බලකාය'
            },
            // Hero Section
            hero: {
                exploreButton: 'අංශය ගවේෂණය කරන්න'
            },
            // Global Connections
            globalConnections: {
                title: 'ශ්‍රී ලංකාව',
                subtitle: 'ලෝකයට සම්බන්ධ කරමින්',
                description: 'ගෝලීය වෙළඳ මාර්ගවල සංසන්දනය තුළ උපාය මාර්ගික ස්ථානයක්. මහාද්වීප සහ සාගර හරහා විහිදෙන අපගේ නැව් ජාලය ගවේෂණය කරන්න.',
                dragHint: 'අදින්න',
                scrollHint: 'අනුචලනය',
                dragText: 'කරකවන්න',
                scrollText: 'විශාලනය කරන්න',
                weeklySailings: 'සතිපතා යාත්‍රා',
                tonnageMoved: 'ප්‍රවාහනය කළ ටොන්',
                transitTime: 'ප්‍රවාහන කාලය',
                activeRoutes: 'ක්‍රියාකාරී මාර්ග',
                annualTonnage: 'වාර්ෂික ටොන්',
                globalPorts: 'ගෝලීය වරායන්'
            },
            // Gallery
            gallery: {
                title: 'අපගේ',
                titleAccent: 'ගමන',
                description: 'නවෝත්පාදන, සහයෝගීතාව සහ විශිෂ්ටත්වය පිළිබඳ අපගේ ලෝකයට පෙනුමක්',
                seeMore: 'තව බලන්න',
                showLess: 'අඩුවෙන් පෙන්වන්න'
            },
            // Testimonials
            testimonials: {
                title: 'සේවාදායක',
                titleAccent: 'ප්‍රශංසා',
                description: 'ගෝලීය පරිමාණයෙන් අපගේ වටිනා හවුල්කරුවන්ගෙන් සාර්ථක කථා'
            },
            // Footer
            footer: {
                quickLinks: 'ඉක්මන් සබැඳි',
                contact: 'සම්බන්ධ වන්න',
                allRightsReserved: 'සියලුම හිමිකම් ඇවිරිණි',
                privacyPolicy: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය',
                termsOfService: 'සේවා කොන්දේසි'
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
