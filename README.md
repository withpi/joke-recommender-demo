# Humor Horoscope Demo

**[Try the live demo →](https://vercel.com/pi-copilot/v0-joke-box-app)**

**Humor Horoscope Demo** is an intelligent joke recommendation system that learns your sense of humor from just **5 ratings** and provides personalized joke recommendations using **[Pi Scoring Models](https://code.withpi.ai/score/writing_rubrics)**.

This repository demonstrates how to solve the **cold start problem** in recommender systems by using tunable scoring models to quickly adapt to user preferences without requiring extensive historical data.

This repository is fully **open source** and serves as a **template** for building personalized recommendation systems.

---

## 🚀 Overview

Traditional recommendation systems face the **cold start problem** — how do you recommend content to new users who haven't rated anything yet? Most systems require hundreds or thousands of user interactions before they can provide meaningful recommendations.

**Humor Horoscope solves this by using Pi Scoring Models** to create personalized scoring rubrics from minimal user feedback. Instead of building complex collaborative filtering systems, we turn user preferences into **tunable scoring models** that can instantly evaluate and rank content.

**Pi Scoring Models** transform your feedback into automatic preference enforcement, allowing you to:
* **Learn quickly** — Get accurate recommendations from just 5 joke ratings
* **Scale efficiently** — Apply the same approach to any content recommendation problem
* **Stay consistent** — Scoring models provide reliable, deterministic evaluation

This framework is fully **extensible** — quickly adapt it to recommend any type of content by editing `/data/jokes.ts` to use your own corpus.

---

## 🧠 Core Concepts

* **Cold Start Solution** – Learn user preferences from minimal feedback (5 ratings) instead of requiring extensive interaction history.
* **Pi Scoring Models** – Tunable evaluators that automatically enforce user preferences and provide consistent scoring.
* **Personalized Rubrics** – Dynamic scoring criteria generated from user ratings that can evaluate any content in your corpus.
* **Content Corpus** – Easily customizable joke collection defined in [`/data/jokes.ts`](./data/jokes.ts).
* **Template Design** – Start from this project to build **custom recommendation systems** for any domain.

---

## 🔑 Environment Setup

This project requires the following API keys. Add them to your `.env.local` file:

```bash
WITHPI_API_KEY=<your_withpi_key>   # https://withpi.ai/account/keys
```

**Note:** This demo uses Pi's scoring models for personalized recommendations. You can get started with a free API key at [withpi.ai](https://withpi.ai).

---

## 🧩 Configuration

### Customizing Your Content Corpus

All jokes used by the recommendation system are defined in:

```
/data/jokes.ts
```

You can easily replace the joke corpus with any content you want to recommend:

```typescript
export const jokes = [
  { id: 1, text: "Your first content item" },
  { id: 2, text: "Your second content item" },
  // Add as many items as you want
  { id: 100, text: "Your hundredth content item" }
]
```

**Examples of content you could recommend:**
* Product descriptions
* Article headlines  
* Song lyrics
* Movie plots
* Restaurant menu items
* News headlines

The system works with any text-based content where users can provide thumbs up/down feedback.

---

## ⚡ Quick Customization Example

Here's how to adapt this system for a different domain — let's say you want to recommend **coffee shop menu items**:

```typescript
// In /data/jokes.ts
export const jokes = [
  { id: 1, text: "Espresso - Rich, bold Italian coffee shot" },
  { id: 2, text: "Cappuccino - Steamed milk with espresso and foam" },
  { id: 3, text: "Latte - Smooth espresso with lots of steamed milk" },
  { id: 4, text: "Americano - Espresso diluted with hot water" },
  { id: 5, text: "Mocha - Chocolate and espresso with steamed milk" },
  { id: 6, text: "Macchiato - Espresso with a dollop of foam" },
  { id: 7, text: "Cold Brew - Smooth, less acidic iced coffee" },
  { id: 8, text: "Frappuccino - Blended ice coffee drink" },
  // Add more items...
]
```

Now your app will recommend coffee drinks instead of jokes! The Pi scoring model will learn what types of coffee descriptions each user prefers and provide personalized recommendations.

**To customize further:**
1. Update the UI text in components to reflect your domain
2. Modify the rating questions to be relevant to your content type
3. Adjust the scoring criteria in the rubric generation

---

## 🧪 Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/withpi/Humor-Horoscope-Demo
   cd Humor-Horoscope-Demo
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Add your `.env.local` file with the required API keys.

4. Start the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6. Navigate to `/demo` to try the recommendation system.

---

## 🎯 How It Works

1. **Rate Content** — Users rate 5 items with thumbs up/down
2. **Generate Rubric** — Pi creates a personalized scoring rubric from the ratings
3. **Score Corpus** — The rubric evaluates every item in your content corpus
4. **Recommend** — Items are ranked by score and presented to the user

The magic happens in the **rubric generation** — Pi's scoring models analyze the patterns in your ratings and create criteria that capture your preferences, then apply those criteria to score the entire corpus.

---

## 🧭 Purpose

Humor Horoscope Demo is designed to illustrate how **minimal user feedback** can power sophisticated recommendation systems.

Instead of requiring extensive user interaction history, **Pi Scoring Models** provide a feedback-driven approach that makes recommendation systems **more accessible**, **faster to deploy**, and **easier to personalize**.

This approach is particularly valuable for:
* **New applications** without existing user data
* **Niche domains** where collaborative filtering isn't feasible  
* **Privacy-conscious** systems that minimize data collection
* **Rapid prototyping** of recommendation features

---

## 🧩 About Pi Labs

[**Pi Labs**](https://withpi.ai) builds **tunable scoring and ranking models** that enable sophisticated AI applications with minimal data.

Unlike standard LLMs, Pi's models are:

* **More consistent** across runs
* **Easier to tune** with preference data
* **Designed for alignment and quality control**
* **Perfect for recommendation systems**

Pi Labs models can be used to enforce preferences, evaluate responses, or improve the reliability of generative systems through reinforcement.

---

## 📄 License

This repository is open source and available under the [MIT License](./LICENSE).

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📚 Learn More

- [Pi Labs Documentation](https://code.withpi.ai/)
- [Pi Scoring Models](https://code.withpi.ai/score/writing_rubrics)
- [Recommendation System Best Practices](https://withpi.ai/blog)