const {
    PromptTemplate
} = require('langchain/prompts')
const {
    Runnable,
    RunnableSequence
} = require('langchain/schema/runnable')
const {
    StringOutputParser
} = require('langchain/schema/output_parser')
const {
    formatDocumentsAsString
} = require('langchain/util/document')
const {
    GooglePaLMEmbeddings
} = require('langchain/embeddings/googlepalm')
const {
    GooglePaLM
} = require('langchain/llms/googlepalm')
const {
    ChatGoogleGenerativeAI
} = require('@langchain/google-genai')
const {
    GoogleVertexAI
} = require('langchain/llms/googlevertexai')
const {
    MongoDBAtlasVectorSearch
} = require('langchain/vectorstores/mongodb_atlas')
const {
    AzureCosmosDBVectorStore,
    AzureCosmosDBSimilarityType,
} = require("@langchain/community/vectorstores/azure_cosmosdb");
const {
    MongoClient
} = require('mongodb');
const markdown = require('markdown').markdown
require('dotenv').config()

/* const model = new GooglePaLM({
    apiKey: process.env.GOOGLE_PALM_API_KEY,
    temperature: 0.9,
    modelName: 'models/text-bison-001'
}); */
const client = new MongoClient(process.env.MONGO_CONNECTION_URL)
const namespace = process.env.MONGO_NAMESPACE;
const [dbName, ] = namespace.split(".");

(async function() {
    await client.connect();
    console.log("Connected successfully to Cosmos DB")
})();

const db = client.db(dbName)
const collection = db.collection("documents");
const vectorstore = new AzureCosmosDBVectorStore(new GooglePaLMEmbeddings({
    apiKey: process.env.GOOGLE_PALM_API_KEY
}), {
    collection,
    indexName: "vectorSearchIndex",
    client,
    connectionString: process.env.MONGO_CONNECTION_URL,
    databaseName: "projectx",
    embeddingKey: "embedding",
    textKey: "text",
    collectionName: "documents"
})

const model = new GoogleVertexAI({
    model: "text-bison-32k",
    temperature: 0.2
}) 

const questionPrompt = PromptTemplate.fromTemplate(
    `
  You are a highly intelligent Q & A bot which can provide *short and crisp* to the point answers to any question based on a given context.
  Use the following pieces of context to answer the question at the end. 
  Strictly Adhere to the below given guidelines.
  Guidelines: Use the context provided as a reference and provide a crisp and short to the point answer to the question provided below. 
              Do not just provide the context as the answer, transform it using your intelligence.
              Strictly Answer to the question which is included below.
              IMPORTANT: Headings begin from level 3 (h3).
                         Return the file directly without backticks.
  ----------------
  CONTEXT: {context}
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  QUESTION: {question}
  ----------------
  Helpful Answer:`
);

async function generate_response(question, course, user, context) {

    const retriever = vectorstore.asRetriever({
        searchType: "mmr",
        searchKwargs: {
            fetchK: 5,
            lambda: 0.1
        },
        filter: {
            "compound": {
                "must": [{
                        "term": {
                            "path": "user",
                            "query": user // Replace 'user' with the actual user value
                        }
                    },
                    course?
                    {
                        "term": {
                            "path": "course",
                            "query": course // Replace 'course' with the actual course value
                        }
                    }: null
                ].filter(Boolean)
            }
        }
    })
    const chain = RunnableSequence.from([{
            question: (input => {
                input.question
                console.log(input.question)
            }),
            chatHistory: (input) => input.chatHistory || "",
            context: async (input) => {
                if(!input.context) {
                    const relevantDocs = await retriever.getRelevantDocuments(input.question);
                    const serialized = formatDocumentsAsString(relevantDocs)
                    return serialized;
                } else 
                    return input.context;
            }
        },
        questionPrompt,
        model,
        new StringOutputParser()
    ])

    const result = await chain.invoke({
        question: question,
        context: context
    })

    let md = (result.trim().startsWith("`") == true ? result.slice("```".length + 1, -('```'.length)): result);
    return markdown.toHTML(md)
}

module.exports = generate_response;