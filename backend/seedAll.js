import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";
import Service from "./models/Service.js";
import Appointment from "./models/Appointment.js";
import ServiceAppointment from "./models/serviceAppointment.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// --- DUMMY IMAGES ---
// If the user hasn't supplied real images, these URLs provide high-quality stock images from Unsplash.
const doctorImages = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594824432258-fdd5f8bb93b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527613426496-f9478f74a8ac?auto=format&fit=crop&w=800&q=80"
];

const serviceImages = [
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
];

const doctors = [
    {
        name: "Dr. Richard James",
        email: "richard.james@example.com",
        password: "hashedpassword123",
        specialization: "General Physician",
        experience: "15 Years",
        qualifications: "MBBS, MD",
        about: "Dr. Richard James is a renowned General Physician with over 15 years of clinical experience. He specializes in preventative care and managing chronic illnesses, combining unparalleled medical acumen with a deeply compassionate approach to patient well-being.",
        location: "New York Core Clinic",
        fee: 1500,
        availability: "Available",
        success: "99%",
        patients: "5000+",
        rating: 4.9,
        imageUrl: doctorImages[0],
        schedule: {
            "2026-03-09": ["09:00 AM", "10:30 AM", "01:00 PM"],
            "2026-03-10": ["10:00 AM", "11:30 AM", "02:00 PM"],
            "2026-03-11": ["09:00 AM", "03:30 PM", "05:00 PM"],
        }
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
        imageUrl: doctorImages[1],
        schedule: {
            "2026-03-09": ["08:00 AM", "11:00 AM", "04:00 PM"],
            "2026-03-12": ["09:00 AM", "01:30 PM", "04:30 PM"],
        }
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
        imageUrl: doctorImages[2],
        schedule: {
            "2026-03-10": ["09:30 AM", "12:00 PM", "03:00 PM"],
            "2026-03-11": ["10:30 AM", "02:00 PM", "05:00 PM"],
        }
    },
    {
        name: "Dr. Sarah Miller",
        email: "sarah.miller@example.com",
        password: "hashedpassword123",
        specialization: "Pediatricians", // matching frontend filter casing if any
        experience: "12 Years",
        qualifications: "MBBS, MD Pediatrics",
        about: "Known for her warm and engaging demeanor, Dr. Miller is a board-certified Pediatrician. She is devoted to providing exceptional healthcare for infants, children, and adolescents.",
        location: "Little Angels Care",
        fee: 1200,
        availability: "Available",
        success: "99%",
        patients: "6000+",
        rating: 4.9,
        imageUrl: doctorImages[3],
        schedule: {
            "2026-03-09": ["10:00 AM", "12:30 PM", "04:00 PM"],
            "2026-03-10": ["09:00 AM", "01:00 PM"],
        }
    },
    {
        name: "Dr. Alexander Wright",
        email: "alexander.wright@example.com",
        password: "hashedpassword123",
        specialization: "Neurologist",
        experience: "20 Years",
        qualifications: "MBBS, DM Neurology",
        about: "Dr. Wright is a distinguished Neurologist with a focus on neurodegenerative diseases and progressive stroke recovery. His evidence-based practices make him a pillar of excellence.",
        location: "Neuroscience Institute",
        fee: 3000,
        availability: "Available",
        success: "96%",
        patients: "2000+",
        rating: 4.8,
        imageUrl: doctorImages[4]
    },
    {
        name: "Dr. Olivia Bennett",
        email: "olivia.bennett@example.com",
        password: "hashedpassword123",
        specialization: "Gastroenterologist",
        experience: "14 Years",
        qualifications: "MBBS, MD, DM",
        about: "Dr. Bennett specializes in the diagnosis and treatment of complex gastrointestinal and liver disorders. Her holistic approach integrates advanced endoscopic procedures with nutritional counseling.",
        location: "Digestive Health Associates",
        fee: 2500,
        availability: "Available",
        success: "97%",
        patients: "3500+",
        rating: 4.9,
        imageUrl: doctorImages[5]
    }
];

const services = [
    {
        name: "Comprehensive Full Body Checkup",
        slug: "full-body-checkup",
        price: 3500,
        about: "A thorough evaluation of your entire body's functioning. Includes 60+ critical tests covering heart, liver, kidney, thyroid, blood profiles, and essential vitamins to give you a complete picture of your health.",
        imageUrl: serviceImages[0],
        available: true,
        instructions: [
            "Fasting required for 10-12 hours before the test.",
            "Do not consume alcohol 24 hours prior to the test.",
            "Bring along any past medical records and current prescriptions.",
            "Wear comfortable, loose clothing."
        ],
        dates: ["2026-03-09", "2026-03-10", "2026-03-11"],
        slots: {
            "2026-03-09": ["08:00 AM", "09:00 AM", "10:00 AM"],
            "2026-03-10": ["07:30 AM", "08:30 AM", "09:30 AM"],
            "2026-03-11": ["08:00 AM", "09:00 AM", "11:00 AM"]
        }
    },
    {
        name: "Advanced Cardiac Screening",
        slug: "cardiac-screening",
        price: 5000,
        about: "A specialized package designed to detect early signs of heart disease. Includes ECG, 2D Echo, TMT, Lipid Profile, and consultation with a senior cardiologist to ensure your heart is strong and healthy.",
        imageUrl: serviceImages[1],
        available: true,
        instructions: [
            "Avoid heavy meals before the test.",
            "Wear sports shoes and comfortable clothing for the TMT (Treadmill Test).",
            "Do not consume caffeine or smoke 4 hours prior."
        ],
        dates: ["2026-03-09", "2026-03-12", "2026-03-14"],
        slots: {
            "2026-03-09": ["10:00 AM", "12:00 PM"],
            "2026-03-12": ["11:00 AM", "02:00 PM"],
            "2026-03-14": ["09:00 AM", "01:00 PM"]
        }
    },
    {
        name: "Full Body MRI Scan",
        slug: "mri-scan",
        price: 12000,
        about: "A non-invasive, high-definition internal body scan using advanced magnetic resonance imaging. Excellent for detecting tumors, joint abnormalities, and neurological conditions with crystal-clear precision.",
        imageUrl: serviceImages[2],
        available: true,
        instructions: [
            "Remove all metallic objects, jewelry, and piercings before entering.",
            "Inform the technician if you have a pacemaker or metallic implants.",
            "Fasting is not required unless specifically instructed."
        ],
        dates: ["2026-03-10", "2026-03-11", "2026-03-13"],
        slots: {
            "2026-03-10": ["09:00 AM", "11:30 AM", "02:30 PM"],
            "2026-03-11": ["10:00 AM", "01:00 PM"],
            "2026-03-13": ["08:30 AM", "12:30 PM", "04:00 PM"]
        }
    },
    {
        name: "Diabetes Management Program",
        slug: "diabetes-management",
        price: 2500,
        about: "A detailed screening and consultation program for diabetic and pre-diabetic patients. Includes HbA1c, Fasting Blood Sugar, Kidney profile, and a personalized diet plan by an expert nutritionist.",
        imageUrl: serviceImages[3],
        available: true,
        instructions: [
            "Strict 12-hour fasting is required.",
            "Continue your regular medication unless informed otherwise.",
            "Collect your urine sample first thing in the morning."
        ],
        dates: ["2026-03-09", "2026-03-15", "2026-03-18"],
        slots: {
            "2026-03-09": ["07:00 AM", "08:00 AM", "09:00 AM"],
            "2026-03-15": ["07:00 AM", "08:30 AM"],
            "2026-03-18": ["08:00 AM", "09:30 AM"]
        }
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

        // 1. CLEAR EXISTING DATA
        await Doctor.deleteMany({});
        await Service.deleteMany({});
        await Appointment.deleteMany({});
        await ServiceAppointment.deleteMany({});
        console.log("Cleared existing records.");

        // 2. SEED DOCTORS
        const createdDoctors = await Doctor.insertMany(doctors);
        console.log(`Successfully seeded ${createdDoctors.length} doctors.`);

        // 3. SEED SERVICES
        const createdServices = await Service.insertMany(services);
        console.log(`Successfully seeded ${createdServices.length} services.`);

        // 4. SEED SAMPLE APPOINTMENTS
        const doc1 = createdDoctors[0]; // Dr. Richard James
        const doc2 = createdDoctors[1]; // Dr. Emily Chen

        const sampleAppointments = [
            {
                doctorId: doc1._id,
                doctorName: doc1.name,
                speciality: doc1.specialization,
                patientName: "John Doe",
                mobile: "9876543210",
                age: 35,
                gender: "Male",
                date: "2026-03-09",
                time: "09:00 AM",
                fees: doc1.fee,
                status: "Confirmed",
                payment: { method: "Online", status: "Paid", amount: doc1.fee },
            },
            {
                doctorId: doc1._id,
                doctorName: doc1.name,
                speciality: doc1.specialization,
                patientName: "Alice Smith",
                mobile: "8765432109",
                age: 28,
                gender: "Female",
                date: "2026-03-10",
                time: "10:00 AM",
                fees: doc1.fee,
                status: "Pending",
                payment: { method: "Online", status: "Pending", amount: doc1.fee },
            },
            {
                doctorId: doc2._id,
                doctorName: doc2.name,
                speciality: doc2.specialization,
                patientName: "Mary Jane",
                mobile: "7654321098",
                age: 42,
                gender: "Female",
                date: "2026-03-09",
                time: "08:00 AM",
                fees: doc2.fee,
                status: "Completed",
                payment: { method: "Cash", status: "Paid", amount: doc2.fee },
            }
        ];
        await Appointment.insertMany(sampleAppointments);
        console.log(`Successfully seeded 3 sample doctor appointments.`);

        // 5. SEED SAMPLE SERVICE APPOINTMENTS
        const svc1 = createdServices[0]; // Full Body Checkup

        const sampleServiceAppointments = [
            {
                serviceId: svc1._id,
                serviceName: svc1.name,
                patientName: "Robert Baratheon",
                mobile: "9123456780",
                age: 55,
                gender: "Male",
                date: "2026-03-09",
                hour: 8,
                minute: 0,
                ampm: "AM",
                fees: svc1.price,
                status: "Confirmed",
                payment: { method: "Online", status: "Paid", amount: svc1.price }
            },
            {
                serviceId: svc1._id,
                serviceName: svc1.name,
                patientName: "Ned Stark",
                mobile: "9876512345",
                age: 45,
                gender: "Male",
                date: "2026-03-10",
                hour: 7,
                minute: 30,
                ampm: "AM",
                fees: svc1.price,
                status: "Pending",
                payment: { method: "Cash", status: "Pending", amount: svc1.price }
            }
        ];
        await ServiceAppointment.insertMany(sampleServiceAppointments);
        console.log(`Successfully seeded 2 sample service appointments.`);

        mongoose.connection.close();
        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDB();
