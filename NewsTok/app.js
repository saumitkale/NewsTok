  import express from 'express';
  import fetch from 'node-fetch';
  import { extract } from 'article-parser';
  import Anthropic from '@anthropic-ai/sdk';
  import * as dotenv from 'dotenv';
  
  dotenv.config();
  const app = express();
  const port = process.env.PORT || 5001;
  
  app.get('/api/articles', async (req, res) => {
      try {
          const source = req.query.source || 'techcrunch';  
          const articleIndex = parseInt(req.query.index, 10) || 0; 
          const fetchURL = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${process.env.NEWS_API_KEY}`;
  
          const response = await fetch(fetchURL);
          
          if (!response.ok) {
              throw new Error('Network error');
          }
  
          const data = await response.json();
          const allArticles = data.articles;
  
          if (articleIndex >= allArticles.length) {
              return res.status(400).json({ error: 'Invalid article index' });
          }
  
          const url = allArticles[articleIndex].url;
          const extractedArticle = await extract(url);
          const passedArticle = extractedArticle.content;
  
          const anthropic = new Anthropic();
          const msg = await anthropic.messages.create({
              model: "claude-3-haiku-20240307",
              max_tokens: 1000,
              temperature: 0.6,
              messages: [
                  {
                      role: "user",
                      content: [
                          {
                              type: "text",
                              text: "Give me a summary of this article given this content of it: " + passedArticle
                          }
                      ]
                  }
              ]
          });
          res.json({ summary: msg.content[0].text, url: url}
          );
  
      } catch (error) {
          res.status(500).json({ error: 'There was a problem with the operation' });
      }
  });
  
  app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
  });
  
