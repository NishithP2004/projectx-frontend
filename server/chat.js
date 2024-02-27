const { PromptTemplate } = require("langchain/prompts");
const { Runnable, RunnableSequence } = require("langchain/schema/runnable");
const { StringOutputParser } = require("langchain/schema/output_parser");
const { formatDocumentsAsString } = require("langchain/util/document");
const { GooglePaLMEmbeddings } = require("langchain/embeddings/googlepalm");
const { GooglePaLM } = require("langchain/llms/googlepalm");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { GoogleVertexAI } = require("langchain/llms/googlevertexai");
const {
  MongoDBAtlasVectorSearch,
} = require("langchain/vectorstores/mongodb_atlas");
const {
  AzureCosmosDBVectorStore,
  AzureCosmosDBSimilarityType,
} = require("@langchain/community/vectorstores/azure_cosmosdb");
const { MongoClient } = require("mongodb");
// const markdown = require('markdown').markdown
const MarkdownIt = require("markdown-it");
const markdown = new MarkdownIt();
require("dotenv").config();

/* const model = new GooglePaLM({
    apiKey: process.env.GOOGLE_PALM_API_KEY,
    temperature: 0.9,
    modelName: 'models/text-bison-001'
}); */
const client = new MongoClient(process.env.MONGO_CONNECTION_URL);
const namespace = process.env.MONGO_NAMESPACE;
const [dbName] = namespace.split(".");

(async function () {
  await client.connect();
  console.log("Connected successfully to Cosmos DB");
})();

const db = client.db(dbName);
const collection = db.collection("documents");
const vectorstore = new AzureCosmosDBVectorStore(
  new GooglePaLMEmbeddings({
    apiKey: process.env.GOOGLE_PALM_API_KEY,
  }),
  {
    collection,
    indexName: "vectorSearchIndex",
    client,
    connectionString: process.env.MONGO_CONNECTION_URL,
    databaseName: "projectx",
    embeddingKey: "embedding",
    textKey: "text",
    collectionName: "documents",
  },
);

const model = new GoogleVertexAI({
  model: "text-bison-32k",
  temperature: 0.2,
});

const preprocessorModel = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey: process.env.GOOGLE_PALM_API_KEY,
});

const questionPrompt = PromptTemplate.fromTemplate(
  `
  You are an helpful assistant.
  You are a highly intelligent Q & A bot which can provide *short and crisp* to the point answers to any question based on a given context.
  Use the following pieces of context to answer the question at the end. 
  Strictly Adhere to the below given guidelines.
  Guidelines: Use the context provided as a reference and provide a crisp and short to the point answer to the question provided below. 
              Do not just provide the context as the answer, transform it using your intelligence.
              Strictly Answer to the question which is included below. 
              If the answer is deviating from the question then regenerate the answer until you arrive at the right answer.
              IMPORTANT: Headings begin from level 3 (h3).
                         Avoid the un-necessary use of bold.
                         Return the rich markdown file directly without backticks.
  ----------------
  CONTEXT: {context}
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  QUESTION: {question}
  ----------------
  Helpful Answer:`,
);

async function generate_response(question, course, user, context) {
  console.log("User:", user);
  console.log("Q: " + question);

  const retriever = vectorstore.asRetriever({
    searchType: "mmr",
    searchKwargs: {
      fetchK: 2,
      lambda: 0.1,
    },
    filter: {
      preFilter: {
        compound: {
          must: [
            {
              text: {
                path: "user",
                query: user,
              },
            },
            course
              ? {
                  text: {
                    path: "course",
                    query: course,
                  },
                }
              : null,
          ].filter(Boolean),
        },
      },
    },
  });
  const chain = RunnableSequence.from([
    {
      question: (input) => {
        input.question;
      },
      chatHistory: (input) => input.chatHistory || "",
      context: async (input) => {
        if (!input.context) {
          const semantics = question
            ? (
                await preprocessorModel.invoke(`Please list the semantic keywords associated with the following user query. Return as a comma-separated list
                                                INPUT: ${question}`)
              ).content
            : question;
          console.log("Semantics: " + semantics);
          let relevantDocs = (
            await retriever.getRelevantDocuments(
              semantics ? semantics.toString() : question,
            )
          ).filter((d) =>
            !course
              ? d.metadata.user === user
              : d.metadata.user == user && d.metadata.course === course,
          );
          if (relevantDocs.length === 0)
            relevantDocs = (
              await retriever.getRelevantDocuments(question)
            ).filter((d) =>
              !course
                ? d.metadata.user === user
                : d.metadata.user == user && d.metadata.course === course,
            );
          const serialized = formatDocumentsAsString(relevantDocs);
          console.log("Serialized Context: " + serialized);
          return serialized;
        } else return input.context;
      },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke({
    question: question,
    context: context,
  });

  let md =
    result.trim().startsWith("`") == true
      ? result.slice("```".length + 1, -"```".length)
      : result;
  return markdown.render(md);
}

module.exports = generate_response;
