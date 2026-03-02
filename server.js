import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/analyze', async (req, res) => {
  try {
    const { image } = req.body;
    if(!image) return res.status(400).json({ error: "No image provided" });

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "حلل البشرة وأرسل JSON مع acne, pig, circles, routine {am, pm}" },
            { type: "input_image", image_url: image }
          ]
        }
      ]
    });

    let textOutput = response.output_text || "{}";
    let result;
    try { result = JSON.parse(textOutput); } 
    catch(e) { result = { error: "Failed JSON parse", raw: textOutput }; }

    res.json(result);

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SkinScanner server running on port ${PORT}`));
