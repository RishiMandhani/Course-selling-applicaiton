import dotenv from "dotenv";
import slugify from "slugify";
import { connectDB } from "../config/db.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";

dotenv.config();

const sampleCourses = [
  {
    title: "AI Engineering Bootcamp",
    description:
      "Master practical AI engineering with prompt design, retrieval pipelines, model integration, evaluation, and full-stack deployment projects.",
    price: 129,
    category: "Artificial Intelligence",
    level: "intermediate",
    requirements: ["JavaScript basics", "API fundamentals", "Git and GitHub"],
    learningOutcomes: [
      "Build AI-powered web apps",
      "Integrate LLM APIs securely",
      "Design prompt and RAG workflows",
      "Deploy production-ready AI services"
    ],
    modules: [
      {
        title: "AI Foundations",
        description: "Understand LLMs, embeddings, prompting, and practical product patterns.",
        order: 1,
        lessons: [
          {
            title: "How Modern AI Apps Work",
            contentType: "document",
            fileUrl: "/uploads/sample-ai-foundations.pdf",
            duration: "20 min",
            freePreview: true,
            order: 1
          },
          {
            title: "Prompt Engineering for Reliable Outputs",
            contentType: "video",
            fileUrl: "/uploads/sample-ai-prompts.mp4",
            duration: "38 min",
            freePreview: true,
            order: 2
          }
        ]
      },
      {
        title: "Build and Deploy",
        description: "Create a full AI feature from backend orchestration to frontend UX.",
        order: 2,
        lessons: [
          {
            title: "RAG API Implementation",
            contentType: "video",
            fileUrl: "/uploads/sample-rag-api.mp4",
            duration: "52 min",
            freePreview: false,
            order: 1
          }
        ]
      }
    ]
  },
  {
    title: "DevOps and Cloud Automation",
    description:
      "Learn CI/CD, Docker, Kubernetes, observability, infrastructure automation, and production release workflows.",
    price: 119,
    category: "DevOps",
    level: "intermediate",
    requirements: ["Linux basics", "Command line comfort", "Basic web deployment knowledge"],
    learningOutcomes: [
      "Containerize Node and React apps",
      "Build CI/CD pipelines",
      "Deploy workloads on Kubernetes",
      "Monitor and troubleshoot production systems"
    ],
    modules: [
      {
        title: "Containers and Pipelines",
        description: "Package services and automate delivery.",
        order: 1,
        lessons: [
          {
            title: "Dockerizing a MERN App",
            contentType: "video",
            fileUrl: "/uploads/sample-docker-mern.mp4",
            duration: "46 min",
            freePreview: true,
            order: 1
          },
          {
            title: "CI/CD Checklist",
            contentType: "document",
            fileUrl: "/uploads/sample-cicd-checklist.pdf",
            duration: "12 min",
            freePreview: true,
            order: 2
          }
        ]
      },
      {
        title: "Kubernetes in Practice",
        description: "Move from containers to orchestration with real deployment patterns.",
        order: 2,
        lessons: [
          {
            title: "Deployments, Services, and Ingress",
            contentType: "video",
            fileUrl: "/uploads/sample-k8s-deployments.mp4",
            duration: "58 min",
            freePreview: false,
            order: 1
          }
        ]
      }
    ]
  },
  {
    title: "Full-Stack MERN from Zero to Production",
    description:
      "Build a complete production-ready MERN application with authentication, payments, dashboards, and deployment.",
    price: 149,
    category: "Web Development",
    level: "beginner",
    requirements: ["HTML and CSS basics", "Basic JavaScript"],
    learningOutcomes: [
      "Design REST APIs with Express",
      "Build reusable React interfaces",
      "Manage app state cleanly",
      "Ship a full-stack product to production"
    ],
    modules: [
      {
        title: "Backend Core",
        description: "Model data, secure endpoints, and structure the API.",
        order: 1,
        lessons: [
          {
            title: "Express Architecture and JWT Auth",
            contentType: "video",
            fileUrl: "/uploads/sample-express-jwt.mp4",
            duration: "49 min",
            freePreview: true,
            order: 1
          }
        ]
      },
      {
        title: "Frontend Experience",
        description: "Build the React app, routes, and state flows.",
        order: 2,
        lessons: [
          {
            title: "Redux Toolkit for Scalable State",
            contentType: "document",
            fileUrl: "/uploads/sample-redux-guide.pdf",
            duration: "18 min",
            freePreview: false,
            order: 1
          }
        ]
      }
    ]
  }
];

const run = async () => {
  await connectDB();

  let admin = await User.findOne({ email: "admin@example.com" });

  if (!admin) {
    admin = await User.create({
      name: "Platform Admin",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin"
    });
  }

  for (const course of sampleCourses) {
    const slug = slugify(course.title, { lower: true, strict: true });

    await Course.findOneAndUpdate(
      { slug },
      {
        ...course,
        slug,
        published: true,
        thumbnailUrl: "",
        createdBy: admin._id
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }

  console.log("Sample courses seeded.");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
