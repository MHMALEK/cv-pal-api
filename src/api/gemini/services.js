// const axios = require("axios");
// const { VertexAI } = require("@google-cloud/vertexai");

// async function callGeminiApi(userId, payload) {
//   try {
//     const response = await axios.post("https://gemini-api-url", payload);

//     return response.data;
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     throw error;
//   }
// }

// // Initialize Vertex with your Cloud project and location
// const vertex_ai = new VertexAI({project: 'cvpal-bf782', location: 'us-central1'});

// const model = "gemini-1.0-pro-vision-001";

// // Instantiate the models
// const generativeModel = vertex_ai.preview.getGenerativeModel({
//   model: model,
//   generationConfig: {
//     maxOutputTokens: 2048,
//     temperature: 0.4,
//     topP: 0.4,
//     topK: 32,
//   },
//   safetySettings: [
//     {
//       category: "HARM_CATEGORY_HATE_SPEECH",
//       threshold: "BLOCK_ONLY_HIGH",
//     },
//     {
//       category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//       threshold: "BLOCK_ONLY_HIGH",
//     },
//     {
//       category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//       threshold: "BLOCK_ONLY_HIGH",
//     },
//     {
//       category: "HARM_CATEGORY_HARASSMENT",
//       threshold: "BLOCK_ONLY_HIGH",
//     },
//   ],
// });

// const text1 = {
//   text: `give me some dummy data about your self`,
// };

// async function generateContent() {
//   const req = {
//     contents: [{ role: "user", parts: [text1] }],
//   };

//   const streamingResp = await generativeModel.generateContentStream(req);

//   for await (const item of streamingResp.stream) {
//     process.stdout.write("stream chunk: " + JSON.stringify(item) + "\n");
//   }

//   process.stdout.write(
//     "aggregated response: " + JSON.stringify(await streamingResp.response)
//   );
// }

// generateContent();

// exports.callGeminiApi = callGeminiApi;

// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const dotenv = require("dotenv");
dotenv.config();

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API_KEY;

async function run() {
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
    text: `Task: Generate a professional CV suitable for a Google Doc format, tailored to the provided job description using the data from the LinkedIn profile.
Inputs:
1. LinkedIn Profile Data
2. Job Description
Output Requirements:
- The CV must be structured to highlight relevance to the job description, emphasizing leadership and technical skills.
- Use bullet points for clarity.
- Include a professional summary at the top that aligns with the job’s requirements.
- Format the experiences in reverse chronological order.
Tone and Language:
- Professional and succinct.
- Use action verbs and quantifiable achievements.
- Integrate keywords from the job description strategically throughout the CV.`,
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [text1] }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log(response.text());
}

run();
