const DEMO_CATALOG_KEY = "coursehub-demo-catalog";
const DEMO_ENROLLMENTS_KEY = "coursehub-demo-enrollments";

const baseDemoCourses = [
  {
    _id: "demo-ai-engineering",
    title: "AI Engineering Bootcamp",
    slug: "ai-engineering-bootcamp",
    description:
      "Build production-grade AI apps with prompt design, retrieval pipelines, model evaluation, and full-stack deployment patterns.",
    price: 129,
    category: "Artificial Intelligence",
    level: "intermediate",
    thumbnailUrl: "",
    requirements: ["JavaScript fundamentals", "REST API basics", "Curiosity about AI products"],
    learningOutcomes: [
      "Integrate LLM APIs into web apps",
      "Design robust prompt workflows",
      "Build RAG-powered features",
      "Deploy AI products with confidence"
    ],
    published: true,
    modules: [
      {
        _id: "demo-ai-module-1",
        title: "Foundations of Applied AI",
        description: "Understand the core building blocks of modern AI products.",
        order: 1,
        lessons: [
          { _id: "demo-ai-lesson-1", title: "How AI Products Really Work", contentType: "document", duration: "20 min", freePreview: true, order: 1 },
          { _id: "demo-ai-lesson-2", title: "Prompt Engineering in Practice", contentType: "video", duration: "38 min", freePreview: true, order: 2 }
        ]
      },
      {
        _id: "demo-ai-module-2",
        title: "RAG and Deployment",
        description: "Ship a useful AI feature with backend orchestration and frontend UX.",
        order: 2,
        lessons: [
          { _id: "demo-ai-lesson-3", title: "Building a Retrieval Pipeline", contentType: "video", duration: "52 min", freePreview: false, order: 1 }
        ]
      }
    ],
    createdBy: { name: "Platform Admin", email: "admin@example.com" },
    demo: true
  },
  {
    _id: "demo-devops-cloud",
    title: "DevOps and Cloud Automation",
    slug: "devops-and-cloud-automation",
    description:
      "Learn Docker, CI/CD, Kubernetes, observability, release engineering, and automation workflows used by modern teams.",
    price: 119,
    category: "DevOps",
    level: "intermediate",
    thumbnailUrl: "",
    requirements: ["Linux basics", "Terminal comfort", "Basic deployment knowledge"],
    learningOutcomes: [
      "Containerize full-stack apps",
      "Design CI/CD pipelines",
      "Deploy to Kubernetes",
      "Monitor production systems"
    ],
    published: true,
    modules: [
      {
        _id: "demo-devops-module-1",
        title: "Containers and Delivery",
        description: "Move from local development to reliable shipping pipelines.",
        order: 1,
        lessons: [
          { _id: "demo-devops-lesson-1", title: "Dockerizing a MERN App", contentType: "video", duration: "46 min", freePreview: true, order: 1 },
          { _id: "demo-devops-lesson-2", title: "CI/CD Release Checklist", contentType: "document", duration: "12 min", freePreview: true, order: 2 }
        ]
      },
      {
        _id: "demo-devops-module-2",
        title: "Kubernetes in Practice",
        description: "Run services cleanly with deployments, services, and ingress patterns.",
        order: 2,
        lessons: [
          { _id: "demo-devops-lesson-3", title: "Deployments, Services, and Ingress", contentType: "video", duration: "58 min", freePreview: false, order: 1 }
        ]
      }
    ],
    createdBy: { name: "Platform Admin", email: "admin@example.com" },
    demo: true
  },
  {
    _id: "demo-mern-zero-to-prod",
    title: "Full-Stack MERN from Zero to Production",
    slug: "full-stack-mern-from-zero-to-production",
    description:
      "Build a complete MERN product with auth, dashboards, API design, state management, and deployment-ready structure.",
    price: 149,
    category: "Web Development",
    level: "beginner",
    thumbnailUrl: "",
    requirements: ["Basic HTML and CSS", "Introductory JavaScript"],
    learningOutcomes: [
      "Design Express APIs",
      "Build React interfaces with routing",
      "Manage state with Redux Toolkit",
      "Ship a polished full-stack project"
    ],
    published: true,
    modules: [
      {
        _id: "demo-mern-module-1",
        title: "Backend Core",
        description: "Set up a clean backend with models, controllers, and JWT auth.",
        order: 1,
        lessons: [
          { _id: "demo-mern-lesson-1", title: "Express Architecture and JWT", contentType: "video", duration: "49 min", freePreview: true, order: 1 }
        ]
      },
      {
        _id: "demo-mern-module-2",
        title: "Frontend Experience",
        description: "Compose pages, routes, and scalable state flows in React.",
        order: 2,
        lessons: [
          { _id: "demo-mern-lesson-2", title: "Redux Toolkit for Real Apps", contentType: "document", duration: "18 min", freePreview: false, order: 1 }
        ]
      }
    ],
    createdBy: { name: "Platform Admin", email: "admin@example.com" },
    demo: true
  },
  {
    _id: "demo-data-analytics",
    title: "Data Analytics with Python and SQL",
    slug: "data-analytics-with-python-and-sql",
    description:
      "Analyze business data, write SQL confidently, build dashboards, and communicate insights through polished reports.",
    price: 99,
    category: "Data Analytics",
    level: "beginner",
    thumbnailUrl: "",
    requirements: ["Basic spreadsheet familiarity"],
    learningOutcomes: [
      "Query data with SQL",
      "Clean and analyze data in Python",
      "Create business dashboards",
      "Present insights clearly"
    ],
    published: true,
    modules: [
      {
        _id: "demo-data-module-1",
        title: "SQL for Insight",
        description: "Learn how analysts pull and shape meaningful data.",
        order: 1,
        lessons: [
          { _id: "demo-data-lesson-1", title: "SELECT, JOIN, GROUP BY", contentType: "video", duration: "41 min", freePreview: true, order: 1 }
        ]
      },
      {
        _id: "demo-data-module-2",
        title: "Python Analytics Workflow",
        description: "Clean, visualize, and explain data with confidence.",
        order: 2,
        lessons: [
          { _id: "demo-data-lesson-2", title: "From Notebook to Dashboard", contentType: "document", duration: "16 min", freePreview: false, order: 1 }
        ]
      }
    ],
    createdBy: { name: "Platform Admin", email: "admin@example.com" },
    demo: true
  }
];

const clone = (value) => JSON.parse(JSON.stringify(value));
const toSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const saveDemoCourses = (courses) => localStorage.setItem(DEMO_CATALOG_KEY, JSON.stringify(courses));

export const getDemoCourses = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_CATALOG_KEY) || "null");
    if (Array.isArray(stored) && stored.length) {
      return stored;
    }
  } catch {
    // ignore storage parsing errors and fall back to defaults
  }

  return clone(baseDemoCourses);
};

export const getDemoCourseById = (id) =>
  getDemoCourses().find((course) => course._id === id || course.slug === id) || null;

export const mergeCourses = (courses) => {
  const merged = new Map();

  [...getDemoCourses(), ...courses].forEach((course) => {
    if (!course?._id) {
      return;
    }

    merged.set(course._id, course);
  });

  return Array.from(merged.values());
};

export const updateDemoCourse = (courseId, updates) => {
  const nextCourses = getDemoCourses().map((course) =>
    course._id === courseId
      ? {
          ...course,
          ...updates,
          slug: toSlug(updates.title || course.title),
          price: Number(updates.price ?? course.price)
        }
      : course
  );

  saveDemoCourses(nextCourses);
  return nextCourses.find((course) => course._id === courseId) || null;
};

export const addDemoModule = (courseId, moduleData) => {
  const nextCourses = getDemoCourses().map((course) => {
    if (course._id !== courseId) {
      return course;
    }

    return {
      ...course,
      modules: [
        ...course.modules,
        {
          _id: `demo-module-${Date.now()}`,
          title: moduleData.title,
          description: moduleData.description,
          order: Number(moduleData.order || course.modules.length + 1),
          lessons: []
        }
      ]
    };
  });

  saveDemoCourses(nextCourses);
  return nextCourses.find((course) => course._id === courseId) || null;
};

export const addDemoLesson = (courseId, moduleId, lessonData) => {
  const nextCourses = getDemoCourses().map((course) => {
    if (course._id !== courseId) {
      return course;
    }

    return {
      ...course,
      modules: course.modules.map((module) => {
        if (module._id !== moduleId) {
          return module;
        }

        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              _id: `demo-lesson-${Date.now()}`,
              title: lessonData.title,
              contentType: lessonData.contentType,
              duration: lessonData.duration,
              freePreview: lessonData.freePreview,
              order: Number(lessonData.order || module.lessons.length + 1)
            }
          ]
        };
      })
    };
  });

  saveDemoCourses(nextCourses);
  return nextCourses.find((course) => course._id === courseId) || null;
};

export const resetDemoCatalog = () => saveDemoCourses(clone(baseDemoCourses));

export const getDemoEnrollments = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_ENROLLMENTS_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const isDemoEnrolled = (courseId) => getDemoEnrollments().includes(courseId);

export const enrollInDemoCourse = (courseId) => {
  const current = getDemoEnrollments();

  if (current.includes(courseId)) {
    return current;
  }

  const next = [...current, courseId];
  localStorage.setItem(DEMO_ENROLLMENTS_KEY, JSON.stringify(next));
  return next;
};

export const getEnrolledDemoCourses = () =>
  getDemoEnrollments()
    .map((courseId) => getDemoCourseById(courseId))
    .filter(Boolean)
    .map((course) => ({
      _id: `demo-purchase-${course._id}`,
      course,
      demo: true
    }));
