-- Seed: 3 Prompt Packs for AI Studio

INSERT INTO public.prompt_packs (title, description, category, difficulty, is_free, prompts)
VALUES
(
  'Start Your Side Hustle',
  'Turn your idea into a real plan. Four AI-powered prompts to validate, name, plan, and pitch your next venture.',
  'business',
  'beginner',
  true,
  '[
    {
      "id": "biz-01",
      "title": "Idea Validator",
      "description": "Find out if your business idea has legs — get honest feedback and next steps.",
      "template": "I have a business idea: {business_idea}. My target audience is {target_audience}. My starting budget is around {budget}. Please evaluate this idea honestly. Tell me: 1) Is there real demand for this? 2) Who are my closest competitors? 3) What are the biggest risks? 4) What should I do in the first 30 days? Be encouraging but real with me.",
      "fields": [
        {"name": "business_idea", "placeholder": "e.g., Custom meal prep delivery for busy parents", "type": "text"},
        {"name": "target_audience", "placeholder": "e.g., Working parents aged 30-45", "type": "text"},
        {"name": "budget", "placeholder": "e.g., $500", "type": "text"}
      ]
    },
    {
      "id": "biz-02",
      "title": "Business Name Generator",
      "description": "Get 10 creative name ideas that fit your brand — plus domain availability tips.",
      "template": "I need a business name for my venture: {business_idea}. The vibe I want is {brand_vibe}. Generate 10 creative business name options. For each name, explain why it works and whether the .com domain is likely available. Include a mix of fun, professional, and clever options.",
      "fields": [
        {"name": "business_idea", "placeholder": "e.g., Eco-friendly cleaning products", "type": "text"},
        {"name": "brand_vibe", "placeholder": "e.g., Modern, approachable, trustworthy", "type": "text"}
      ]
    },
    {
      "id": "biz-03",
      "title": "First 100 Customers Plan",
      "description": "A step-by-step playbook to get your first 100 paying customers.",
      "template": "My business is {business_idea} targeting {target_audience}. My budget for marketing is {budget}. Create a detailed 30-day plan to get my first 100 customers. Include: free marketing tactics, paid strategies if budget allows, exact scripts for outreach, social media content ideas, and partnerships to pursue. Make it actionable — I should be able to start today.",
      "fields": [
        {"name": "business_idea", "placeholder": "e.g., Online tutoring for high schoolers", "type": "text"},
        {"name": "target_audience", "placeholder": "e.g., Parents of high school students", "type": "text"},
        {"name": "budget", "placeholder": "e.g., $200/month", "type": "text"}
      ]
    },
    {
      "id": "biz-04",
      "title": "Elevator Pitch Writer",
      "description": "Craft a 30-second pitch that makes people want to know more.",
      "template": "My business is {business_idea}. The problem I solve is {problem}. What makes me different is {differentiator}. Write me 3 versions of a 30-second elevator pitch: one for investors, one for potential customers, and one for a casual conversation at a party. Keep each under 60 words. Make them memorable and natural-sounding.",
      "fields": [
        {"name": "business_idea", "placeholder": "e.g., AI-powered resume builder", "type": "text"},
        {"name": "problem", "placeholder": "e.g., Job seekers spend hours writing resumes that don''t get noticed", "type": "text"},
        {"name": "differentiator", "placeholder": "e.g., We tailor each resume to the specific job posting", "type": "text"}
      ]
    }
  ]'::jsonb
),
(
  'Build With Your Person',
  'Strengthen your relationship with AI-assisted conversations, plans, and letters. Made for couples who want to grow together.',
  'relationships',
  'beginner',
  false,
  '[
    {
      "id": "rel-01",
      "title": "Conversation Starter Kit",
      "description": "10 deep, fun questions to spark a real conversation tonight.",
      "template": "My partner''s name is {partner_name}. We''ve been together {relationship_length}. Something we both enjoy is {shared_interest}. Generate 10 conversation starters for us — mix of deep, fun, and playful. Avoid anything that feels like therapy. These should feel natural, like something you''d actually want to talk about over dinner. Include a mix of light and meaningful.",
      "fields": [
        {"name": "partner_name", "placeholder": "e.g., Alex", "type": "text"},
        {"name": "relationship_length", "placeholder": "e.g., 3 years", "type": "text"},
        {"name": "shared_interest", "placeholder": "e.g., cooking, hiking, true crime podcasts", "type": "text"}
      ]
    },
    {
      "id": "rel-02",
      "title": "Date Night Planner",
      "description": "Get a personalized date night plan based on your interests and budget.",
      "template": "Plan a date night for me and {partner_name}. We enjoy {shared_interest}. Our budget is {budget}. We live in {location}. Give us 3 date night options: one adventurous, one cozy, and one totally unique. For each, include: what to do, what to eat/drink, a conversation topic for the evening, and a small surprise gesture. Make it feel special, not generic.",
      "fields": [
        {"name": "partner_name", "placeholder": "e.g., Jordan", "type": "text"},
        {"name": "shared_interest", "placeholder": "e.g., live music, trying new food", "type": "text"},
        {"name": "budget", "placeholder": "e.g., $75", "type": "text"},
        {"name": "location", "placeholder": "e.g., Austin, TX", "type": "text"}
      ]
    },
    {
      "id": "rel-03",
      "title": "Shared Goal Builder",
      "description": "Create a goal you can chase together — with a plan you can both follow.",
      "template": "My partner {partner_name} and I want to work on a shared goal: {shared_goal}. Our timeline is {timeline}. Help us build a plan we can do together. Include: weekly milestones, how to divide responsibilities fairly, check-in prompts for each week, and what to do if we fall behind. Make it feel like a team project, not a chore.",
      "fields": [
        {"name": "partner_name", "placeholder": "e.g., Sam", "type": "text"},
        {"name": "shared_goal", "placeholder": "e.g., Save $5,000 for a vacation", "type": "textarea"},
        {"name": "timeline", "placeholder": "e.g., 6 months", "type": "text"}
      ]
    },
    {
      "id": "rel-04",
      "title": "Appreciation Letter Writer",
      "description": "Write a heartfelt letter to your person — we help you find the right words.",
      "template": "Help me write a heartfelt letter to {partner_name}. The occasion is {occasion}. Something specific I appreciate about them: {appreciation}. A memory I want to mention: {memory}. Write a warm, genuine letter that sounds like me (not a Hallmark card). Keep it 200-300 words. Make it the kind of thing they''d want to keep.",
      "fields": [
        {"name": "partner_name", "placeholder": "e.g., Taylor", "type": "text"},
        {"name": "occasion", "placeholder": "e.g., our anniversary, just because, after a hard week", "type": "text"},
        {"name": "appreciation", "placeholder": "e.g., They always know how to make me laugh when I''m stressed", "type": "textarea"},
        {"name": "memory", "placeholder": "e.g., That road trip where we got lost and found that amazing diner", "type": "textarea"}
      ]
    }
  ]'::jsonb
),
(
  'AI for the Everyday',
  'Not sure where to start with AI? These four prompts make it simple. Explain things, compare options, make decisions, and optimize your day.',
  'learning',
  'beginner',
  true,
  '[
    {
      "id": "learn-01",
      "title": "Explain Like I''m 5",
      "description": "Get a simple, jargon-free explanation of anything.",
      "template": "Explain {topic} to me like I''m 5 years old. Use a simple analogy that anyone could understand. Then give me: 1) The one-sentence version, 2) The 3-minute version with a real-world example, 3) Why it actually matters in everyday life. No jargon. No showing off. Just make it click.",
      "fields": [
        {"name": "topic", "placeholder": "e.g., How the stock market works, What is blockchain, How do vaccines work", "type": "text"}
      ]
    },
    {
      "id": "learn-02",
      "title": "Compare Two Things",
      "description": "Can''t decide between two options? Get an honest, side-by-side breakdown.",
      "template": "Compare {thing_a} vs {thing_b} for me. I''m trying to decide which is better for {context}. Give me: 1) A quick summary of each, 2) A side-by-side comparison table of pros and cons, 3) Who each option is best for, 4) Your honest recommendation based on my situation. Be direct — I want a real opinion, not a cop-out.",
      "fields": [
        {"name": "thing_a", "placeholder": "e.g., iPhone 16, Renting, Learning Python", "type": "text"},
        {"name": "thing_b", "placeholder": "e.g., Samsung Galaxy S25, Buying, Learning JavaScript", "type": "text"},
        {"name": "context", "placeholder": "e.g., a first-time smartphone buyer, a family of 4 in Denver", "type": "text"}
      ]
    },
    {
      "id": "learn-03",
      "title": "Decision Helper",
      "description": "Stuck on a big decision? Walk through it step by step.",
      "template": "I''m trying to decide: {decision}. Here''s what I''m weighing: {considerations}. Help me think through this clearly. Give me: 1) A pro/con list, 2) What I might be overlooking, 3) The ''regret test'' — which choice would I regret more in 5 years?, 4) A clear recommendation with reasoning. Be honest, not just supportive.",
      "fields": [
        {"name": "decision", "placeholder": "e.g., Should I go back to school or start freelancing?", "type": "text"},
        {"name": "considerations", "placeholder": "e.g., I have 2 kids, $10k in savings, and I''m burned out at my current job", "type": "textarea"}
      ]
    },
    {
      "id": "learn-04",
      "title": "Daily Routine Optimizer",
      "description": "Share your current routine and get a better one — tailored to your life.",
      "template": "Here''s my current daily routine: {current_routine}. My main goals right now are: {goals}. The biggest challenge in my day is: {challenge}. Redesign my daily routine to be more productive and sustainable. Include: specific time blocks, breaks, and wind-down rituals. Explain why each change helps. Keep it realistic — I''m a real person, not a robot.",
      "fields": [
        {"name": "current_routine", "placeholder": "e.g., Wake up 7am, scroll phone 30min, rush to work, eat lunch at desk...", "type": "textarea"},
        {"name": "goals", "placeholder": "e.g., Exercise more, read before bed, be less stressed", "type": "text"},
        {"name": "challenge", "placeholder": "e.g., I hit a wall at 2pm and can''t focus", "type": "text"}
      ]
    }
  ]'::jsonb
);
