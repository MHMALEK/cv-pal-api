const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const dotenv = require("dotenv");
dotenv.config();

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API_KEY;

function convertJsonToStructuredText(jsonData) {
  let text = `Task: Generate a professional CV suitable for a Google Doc format.
Inputs:
1. Personal and Professional Details:
    - About: ${jsonData.about}
    - Education: ${jsonData.education}
    - Experience: ${jsonData.experience}
    - Projects: ${jsonData.projects}
Output Requirements:
- The CV must be structured to highlight relevant experiences and skills.
- Include a professional summary at the top.
- Format the experiences in reverse chronological order.
Tone and Language:
- Professional and succinct.
- Use action verbs and quantifiable achievements.`;

  return text;
}

async function callGeminiApi(linkedinData) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const text1 = {
    text: convertJsonToStructuredText(linkedinData),
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [text1] }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response.text();
}

const data = {
  about:
    "Mohammad Hossein Malek  Senior software engineer  KLM Royal Dutch Airlines  Amsterdam, North Holland, Netherlands  Contact info      5,538followers   500+connections     Open to       Add profile section     More Send profile in a message  Save to PDF  Build a resume   About this profile About this profile      Open to work  Senior Software Engineer, Frontend Developer, Frontend Engineer, Senior Frontend Developer and Software Engineer roles  Show details  Edit  Share that you’re hiringand attract qualified candidates. Get started  Showcase servicesyou offer so you and your business can be found in search. Get started",
  education:
    "EducationEducation        Azad University (IAU)Azad University (IAU)  Master's degree, Industrial Engineering - Project managementMaster's degree, Industrial Engineering - Project management  2018 - 20202018 - 2020  Azad University (IAU)Azad University (IAU)  Bachelor's degree, Mechanical EngineeringBachelor's degree, Mechanical Engineering  2011 - 20162011 - 2016",
  experience:
    "ExperienceExperience        Senior Software EngineerSenior Software Engineer  KLM Royal Dutch Airlines · Full-timeKLM Royal Dutch Airlines · Full-time  Aug 2022 - Present · 1 yr 10 mosAug 2022 - Present · 1 yr 10 mos  Amsterdam, North Holland, Netherlands · On-siteAmsterdam, North Holland, Netherlands · On-site   Working on flight domain as part of software engineering team with BE developers, scrum master and product owner. We are responsible for maintaining, developing and implementing crew related applications at KLM.Working on flight domain as part of software engineering team with BE developers, scrum master and product owner.\nWe are responsible for maintaining, developing and implementing crew related applications at KLM.  Back-End Web Development, Amazon Web Services (AWS) and +9 skills  Senior Software Engineering ConsultantSenior Software Engineering Consultant  iO · Full-timeiO · Full-time  Jul 2021 - Present · 2 yrs 11 mosJul 2021 - Present · 2 yrs 11 mos  Amsterdam, North Holland, NetherlandsAmsterdam, North Holland, Netherlands   Back-End Web Development, Amazon Web Services (AWS) and +9 skills  Senior Software EngineerSenior Software Engineer  Quin · Full-timeQuin · Full-time  Aug 2021 - Aug 2022 · 1 yr 1 moAug 2021 - Aug 2022 · 1 yr 1 mo  Amsterdam, North Holland, NetherlandsAmsterdam, North Holland, Netherlands   Quin is a start-up in the medical IT sector. I was contracted as a Frontend engineer for  React Native health-tracking application. We trained data-science models with an on-site General Practitioner application. The models are used in the React Native application to automate some parts of the client triage. I was also spearheading integrations and the development of a new web-based application that connects directly to General Practitioner and Hospital systems based on FHIR standards. Responsibilities: - Web development – ES6, Typescript, React, Redux, Webpack - App development – ES6, Typescript, React Native, Redux, Redux-saga - Unit and functional testing using Jest, Chai, Mocha, Selenium - Client performance optimizations - Code reviews - Colleague mentorship - Documenting features What makes me proud to work here: - test coverage for every single part of the application - improvement in performance and UX UI with the help of knowledgeable UX/UI designers - fix bugs and issues with the help of a great QA teamQuin is a start-up in the medical IT sector. I was contracted as a Frontend engineer for  React Native health-tracking application. We trained data-science models with an on-site General Practitioner\napplication. The models are used in the React Native application to\nautomate some parts of the client triage.\nI was also spearheading integrations and the development of a new web-based application that connects directly to General Practitioner and Hospital systems based on FHIR standards.\n\nResponsibilities:\n- Web development – ES6, Typescript, React, Redux, Webpack\n- App development – ES6, Typescript, React Native, Redux, Redux-saga\n- Unit and functional testing using Jest, Chai, Mocha, Selenium\n- Client performance optimizations\n- Code reviews\n- Colleague mentorship\n- Documenting features\n\nWhat makes me proud to work here:\n\n- test coverage for every single part of the application \n- improvement in performance and UX UI with the help of knowledgeable UX/UI designers\n- fix bugs and issues with the help of a great QA team  Back-End Web Development, Amazon Web Services (AWS) and +6 skills  Frontend DeveloperFrontend Developer  Snapp!Snapp!  Jul 2018 - Jan 2021 · 2 yrs 7 mosJul 2018 - Jan 2021 · 2 yrs 7 mos   Working as a member of great and productive team of developers, responsible for developing main products at snapp. Our main and noticeable products are: 1- Corporate web application that is a special version for organizations. 2- passengers Web application that is a web based application and have all features of android and iOS apps with seemingly experience. 3- snapp.ir website as the main website of organization . We use react as our main Javascript framework and use Redux to manage our app’s state. We also use redux saga to handle side effects. At snapp, we are so excited and  Eager to learn modern technologies and best practices on the JavaScript communitiy. As a result we always try to make our customized webpack config, css modules and atomic CSS pattern and etc to make a greater product. Used ReactJS to create views to hook up models to the DOM and synchronize data with server as a Single Page Application (SPA). •\tused Mapbpx and google map as main map component •\tused Redux as main StateManager •\tused Redux Thunk for handle side effects •\tUsed Webpack to minify and bundle the code along with gulp. •\tDeveloping CSS Style for web page using SASS Structure. •\tused atomic css pattern to maintain css. We used CSS Modules for that case. •\tInvolved in writing application level code to interact with APIs, RESTful Web Services •\tWrite Unit Test suites using Jest and Enzyme. •\tWork with Product Owners, UX Designers build conceptual demos and POCs •\tWork with QA team on daily basis in fixing the reported bugs/defects and checking cross platform compatibility. •\tFollow Agile methodology and Test-Driven Development •\tEnd to End testing of application at development phase to make sure of the functionality on different devices. We used test cafe beside Cypress. - SEO improvements that resulted in 90% improvements at lighthouse reports. - creating CI/CD, handling deploys and production releases.Working as a member of great and productive team of developers, responsible for developing main products at snapp. \nOur main and noticeable products are: \n1- Corporate web application that is a special version for organizations. \n2- passengers Web application that is a web based application and have all features of android and iOS apps with seemingly experience. \n3- snapp.ir website as the main website of organization .\n\nWe use react as our main Javascript framework and use Redux to manage our app’s state. We also use redux saga to handle side effects.\nAt snapp, we are so excited and  Eager to learn modern technologies and best practices on the JavaScript communitiy.\nAs a result we always try to make our customized webpack config, css modules and atomic CSS pattern and etc to make a greater product.\n\nUsed ReactJS to create views to hook up models to the DOM and synchronize data with server as a Single Page Application (SPA).\n•\tused Mapbpx and google map as main map component\n•\tused Redux as main StateManager\n•\tused Redux Thunk for handle side effects\n•\tUsed Webpack to minify and bundle the code along with gulp.\n•\tDeveloping CSS Style for web page using SASS Structure.\n•\tused atomic css pattern to maintain css. We used CSS Modules for that case.\n•\tInvolved in writing application level code to interact with APIs, RESTful Web Services\n•\tWrite Unit Test suites using Jest and Enzyme.\n•\tWork with Product Owners, UX Designers build conceptual demos and POCs\n•\tWork with QA team on daily basis in fixing the reported bugs/defects and checking cross platform compatibility.\n•\tFollow Agile methodology and Test-Driven Development\n•\tEnd to End testing of application at development phase to make sure of the functionality on different devices. We used test cafe beside Cypress.\n- SEO improvements that resulted in 90% improvements at lighthouse reports. \n- creating CI/CD, handling deploys and production releases.  Amazon Web Services (AWS), Jest and +4 skills  Senior Frontend EngineerSenior Frontend Engineer  Wall it · Part-timeWall it · Part-time  Apr 2020 - Sep 2020 · 6 mosApr 2020 - Sep 2020 · 6 mos   - re-engineered web application with Gatsby, Redux, Typescript which resulted in a 45% reduction in the final JS bundle, 92% reduction in CSS file, and a major increase in SEO (based on lightHouse reports). - developed and maintained a special UI-kit library for the company with React and Typescript. with more than 90% of test coverage, it was built from scratch and has been published as a private npm package. - Training and mentoring new developers who join the team. helping them on their tasks and answering their questions. It helps us to find amazing people. - SEO improvements that resulted in 90% improvements at lighthouse reports. - developed an enterprise-level, offline first project with React. - creating CI/CD, handling deploys and production releases. - managing and structuring as (Tech Lead) on a cross-functional (including Designers, Developers, QA, product managers, and …) team. We were reviewing merge requests, creating and setting code-conventions, writing project documentation, and writing tests for every single page. - design and implementation of product features and Contribute to make our easy-to-use platform a great user experience- re-engineered web application with Gatsby, Redux, Typescript which resulted in a 45% reduction in the final JS bundle, 92% reduction in CSS file, and a major increase in SEO (based on lightHouse reports).\n- developed and maintained a special UI-kit library for the company with React and Typescript. with more than 90% of test coverage, it was built from scratch and has been published as a private npm package. \n- Training and mentoring new developers who join the team. helping them on their tasks and answering their questions. It helps us to find amazing people.\n\n- SEO improvements that resulted in 90% improvements at lighthouse reports. \n\n- developed an enterprise-level, offline first project with React.\n- creating CI/CD, handling deploys and production releases.\n- managing and structuring as (Tech Lead) on a cross-functional (including Designers, Developers, QA, product managers, and …) team. We were reviewing merge requests, creating and setting code-conventions, writing project documentation, and writing tests for every single page.\n- design and implementation of product features and Contribute to make our easy-to-use platform a great user experience  Amazon Web Services (AWS), Jest and +2 skills  Show all 11 experiences",
  insights:
    "AnalyticsAnalytics  Private to youPrivate to you        120 profile views120 profile views  Discover who's viewed your profile.Discover who's viewed your profile.  598 post impressions598 post impressions  Check out who's engaging with your posts.Check out who's engaging with your posts.  Past 7 daysPast 7 days  64 search appearances64 search appearances  See how often you appear in search results.See how often you appear in search results.  Show all analytics",
  languages:
    "LanguagesLanguages        EnglishEnglish  Professional working proficiencyProfessional working proficiency",
  name: "Mohammad Hossein Malek",
  projects:
    "ProjectsProjects        Phonepay WebsitePhonepay Website  Mar 2019 - PresentMar 2019 - Present   Associated with PhonepayAssociated with Phonepay  Show project  Redesigned phonepay website.Redesigned phonepay website.  Snapp web applicationSnapp web application  Apr 2018 - PresentApr 2018 - Present   Associated with Snapp!Associated with Snapp!  Show project  Working with a team of developers responsible for developing three main products at snapp. Corporate web application that is a special version for organizations. Web application that is a web based application and have all features of android and ios. snapp.ir that was the main website.Working with a team of developers responsible for developing three main products at snapp. Corporate web application that is a special version for organizations. Web application that is a web based application and have all features of android and ios. snapp.ir that was the main website.  Show all 8 projects",
};

callGeminiApi(data).then((res) => console.log(res));

export default callGeminiApi;
