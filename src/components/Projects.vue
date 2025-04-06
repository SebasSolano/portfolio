<script setup>
  import { ref } from "vue";
  import Label from "./icons/Label.vue"

  const visibleMap = ref({});

  const toggleVisible = (projectTitle, value) => {
    visibleMap.value[projectTitle] = value;
  };

  const generateImagePaths = (projectName, count = 3) => {
    const formattedName = projectName.toLowerCase().replace(/\s+/g, "");
    const paths = [];

    for (let i = 1; i <= count; i++) {
      paths.push(`/src/assets/img/${formattedName}/image_${i}.jpeg`);
    }

    return paths;
  };

  const projects = [
    {
      title: "GradeGain",
      description:
        "This web application functions as a tasks and notes rewards.",
      imageCount: 13,
      technologies: ["Vue", "JavaScript", "Firebase", "Pinia"],
      link: "https://gradegain.co",
      github: "",
      category: "Tasks",
      type: "Frontend",
      finished: true,
      collaboration: true,
    },
    {
      title: "Dueword",
      description:
        "Dueword is an exciting real-time web game where you translate words in 60 seconds and use strategic cards to win or annoy your opponents.",
      imageCount: 0,
      technologies: ["NodeJS", "TypeScript", "Socket.io"],
      link: "",
      github: "",
      category: "Games",
      type: "FullStack",
      finished: false,
      collaboration: false,
    },
    {
      title: "User management API",
      description:
        "This is a simple api where you manage user registration, login and CRUD.",
      imageCount: 1,
      technologies: ["NodeJS", "TypeScript", "MongoDB"],
      link: "",
      github: "https://github.com/SebasSolano/api-node-ts-mdb",
      category: "API",
      type: "Backend",
      finished: true,
      collaboration: false,
    },
    {
      title: "ToDo application with Drag and Drop",
      description:
        "This is a ToDo app with Laravel 10 and Vue.js that allows you to manage and move tasks with Trello style from registration to status changes.",
      imageCount: 1,
      technologies: ["Laravel", "Php", "Vue", "JavaScript", "Vuex", "MySQL"],
      link: "https://to-do-peach-nu.vercel.app",
      github: "https://github.com/SebasSolano/ToDo-vue-laravel",
      category: "Tasks",
      type: "FullStack",
      finished: true,
      collaboration: false,
    },
    {
      title: "StatsSD (Spectre Divide)",
      description:
        "This is an application to fill the game history in the Spectre Divide game.",
      imageCount: 3,
      technologies: ["Vue", "JavaScript"],
      link: "spectre-stats.vercel.app",
      github: "https://github.com/SebasSolano/statsSD",
      category: "Statistics",
      type: "Frontend",
      finished: true,
      collaboration: false,
    },
    {
      title: "Barroca Register",
      description:
        "A web application for hotels that streamlines check-in and minimizes guest wait times.",
      imageCount: 1,
      technologies: ["Vue", "JavaScript"],
      link: "https://baroca-front.vercel.app",
      github: "https://github.com/SebasSolano/baroca-front",
      category: "Check-In Digital",
      type: "Frontend",
      finished: true,
      collaboration: false,
    },
    {
      title: "Barroca Register API",
      description: "This is the api of de Barroca Register.",
      imageCount: 1,
      technologies: ["NodeJS", "Express", "JavaScript", "PostgreSQL"],
      link: "",
      github: "https://github.com/carlostirado23/Preregistro",
      category: "API",
      type: "Backend",
      finished: true,
      collaboration: true,
    },
    {
      title: "BodyFit App",
      description:
        "A mobile-optimized web app that helps you manage your weight, suggests personalized routines and informs you with weekly news from the world of fitness",
      imageCount: 1,
      technologies: ["Vue", "Firebase", "JavaScript", "TypeScript"],
      link: "",
      github: "https://github.com/SebasSolano/bodyfit",
      category: "Gym",
      type: "Frontend",
      finished: true,
      collaboration: false,
    },
    {
      title: "OGfiducia Automatic",
      description:
        "This is a desktop application that was made to improve the system of union and comprehension of files for a governmental entity of the mayor's office of Monteria.",
      imageCount: 2,
      technologies: ["Python", "PyQt6"],
      link: "",
      github: "https://github.com/SebasSolano/OGfiducia_Automatic",
      category: "Automation",
      type: "Desktop application",
      finished: true,
      collaboration: false,
    },
    {
      title: "VeterinariaAPP",
      description:
        "This is a web application adapted to mobile, for the complete management of the animals of a veterinary. ",
      imageCount: 1,
      technologies: ["Php", "MySQL"],
      link: "",
      github: "https://github.com/SebasSolano/veterinariaAPP",
      category: "Management",
      type: "FullStack",
      finished: true,
      collaboration: false,
    },
  ];

  projects.forEach((project) => {
    if (!project.image) {
      project.image = project.imageCount
        ? generateImagePaths(project.title, project.imageCount)
        : [""];
    }
  });
</script>

<template>
  <section id="projects" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="text-center mb-12 transition-all duration-600 hover-lift cursor-pointer"
      >
        <h2 class="text-3xl font-bold text-gray-900">Featured Projects</h2>
        <div class="w-48 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in projects" :key="project.title" class="relative">
          <div v-if="project.title === 'GradeGain'" class="">
            <Label/>
          </div>

          <div
            class="flex flex-col justify-between bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow hover-lift min-h-[550px] max-h-[550px]"
          >
            <div class="relative flex items-center justify-center">
              <div
                v-if="project.image === null && !project.finished"
                class="w-full h-48 flex items-center justify-center bg-gray-200 text-xl font-semibold text-gray-900"
              >
                In development
              </div>
              <a-image
                v-else
                :preview="{ visible: false }"
                class="w-96 max-h-52"
                :src="project.image[0]"
                @click="toggleVisible(project.title, true)"
              />
              <div style="display: none">
                <a-image-preview-group
                  :preview="{
                    visible: visibleMap[project.title],
                    onVisibleChange: (vis) => toggleVisible(project.title, vis),
                    current: 0,
                  }"
                >
                  <a-image
                    v-for="(img, index) in project.image"
                    :key="index"
                    :src="img"
                  />
                </a-image-preview-group>
              </div>
              <span
                class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary-600 text-sm px-3 py-1 rounded-full font-medium"
              >
                {{ project.category }}
              </span>
            </div>
            <div class="p-6 flex flex-col justify-between h-96">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  {{ project.title }}
                </h3>
                <p class="text-gray-600 mb-4">{{ project.description }}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full font-medium"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="flex item justify-between">
                <div class="flex gap-4">
                  <a
                    v-if="project.link !== '' && project.finished"
                    :href="project.link"
                    class="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 hover-lift"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Live Demo</span>
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <span
                    v-else-if="project.link === '' && !project.finished"
                    class="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    In development
                  </span>
                  <a
                    v-if="project.github !== ''"
                    :href="project.github"
                    class="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 hover-lift"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>GitHub</span>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <div
                    v-else
                    class="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Private</span>
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <span
                  class="p-2 bg-primary-200 rounded-xl cursor-pointer text-sm text-primary-900"
                >
                  {{ project.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
