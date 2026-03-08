import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js"; // Ensure path is correct relative to backend root

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const doctors = [
    {
        name: "Dr. Richard James",
        email: "richard.james@example.com",
        password: "hashedpassword123", // Doesn't matter for dummy data unless login is strictly required
        specialization: "General physician",
        experience: "15 Years",
        qualifications: "MBBS, MD",
        about: "Dr. Richard James is a renowned General Physician with over 15 years of clinical experience. He specializes in preventative care and managing chronic illnesses, combining unparalleled medical acumen with a deeply compassionate approach to patient well-being.",
        location: "New York Core Clinic",
        fee: 1500,
        availability: "Available",
        success: "99%",
        patients: "5000+",
        rating: 4.9,
        imageUrl: "" // Deliberately blank so the frontend fallbacks (D1) kick in
    },
    {
        name: "Dr. Emily Chen",
        email: "emily.chen@example.com",
        password: "hashedpassword123",
        specialization: "Gynecologist",
        experience: "10 Years",
        qualifications: "MBBS, MS",
        about: "Specializing in women's reproductive health, Dr. Chen offers comprehensive obstetric and gynecological care. She is dedicated to empowering her patients with knowledge and state-of-the-art medical solutions tailored to individual needs.",
        location: "Sunrise Women's Hospital",
        fee: 2000,
        availability: "Available",
        success: "98%",
        patients: "3000+",
        rating: 4.8,
        imageUrl: ""
    },
    {
        name: "Dr. Michael Davies",
        email: "michael.davies@example.com",
        password: "hashedpassword123",
        specialization: "Dermatologist",
        experience: "8 Years",
        qualifications: "MBBS, DDVL",
        about: "Dr. Davies is a leading expert in clinical and cosmetic dermatology. With an artistic eye and scientific precision, he helps patients achieve optimal skin health using the latest technological advancements in aesthetic medicine.",
        location: "Elite Skin Center",
        fee: 1800,
        availability: "Available",
        success: "95%",
        patients: "4500+",
        rating: 4.7,
        imageUrl: ""
    },
    {
        name: "Dr. Sarah Miller",
        email: "sarah.miller@example.com",
        password: "hashedpassword123",
        specialization: "Pediatricians",
        experience: "12 Years",
        qualifications: "MBBS, MD Pediatrics",
        about: "Known for her warm and engaging demeanor, Dr. Miller is a board-certified Pediatrician. She is devoted to providing exceptional healthcare for infants, children, and adolescents, ensuring they reach their full developmental potential.",
        location: "Little Angels Care",
        fee: 1200,
        availability: "Available",
        success: "99%",
        patients: "6000+",
        rating: 4.9,
        imageUrl: ""
    },
    {
        name: "Dr. Alexander Wright",
        email: "alexander.wright@example.com",
        password: "hashedpassword123",
        specialization: "Neurologist",
        experience: "20 Years",
        qualifications: "MBBS, DM Neurology",
        about: "Dr. Wright is a distinguished Neurologist with a focus on neurodegenerative diseases and progressive stroke recovery. His evidence-based practices and involvement in cutting-edge research make him a pillar of excellence in neurological care.",
        location: "Neuroscience Institute",
        fee: 3000,
        availability: "Available",
        success: "96%",
        patients: "2000+",
        rating: 4.8,
        imageUrl: ""
    },
    {
        name: "Dr. Olivia Bennett",
        email: "olivia.bennett@example.com",
        password: "hashedpassword123",
        specialization: "Gastroenterologist",
        experience: "14 Years",
        qualifications: "MBBS, MD, DM",
        about: "Dr. Bennett specializes in the diagnosis and treatment of complex gastrointestinal and liver disorders. Her holistic approach integrates advanced endoscopic procedures with personalized nutritional counseling pathways.",
        location: "Digestive Health Associates",
        fee: 2500,
        availability: "Available",
        success: "97%",
        patients: "3500+",
        rating: 4.9,
        imageUrl: ""
    }
];

const seedDB = async () => {
    try {
        if (!MONGODB_URI) {
            console.error("No MongoDB URI found in environment variables.");
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Delete existing data to prevent duplicates during multiple seeds
        await Doctor.deleteMany({});
        console.log("Cleared existing doctor records.");

        await Doctor.insertMany(doctors);
        console.log(`Successfully seeded ${doctors.length} premium doctor profiles.`);

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDB();
