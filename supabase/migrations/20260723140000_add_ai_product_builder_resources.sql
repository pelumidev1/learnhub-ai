-- =============================================================================
-- Curated free-first resources for the "AI Product Builder" career
-- =============================================================================
-- Idempotent: only seeds if this career has no resources yet, so re-running
-- (or running after they were added by hand) is harmless.

do $$
declare
  v_career_id uuid;
begin
  select id into v_career_id from public.careers where slug = 'ai-product-builder';
  if v_career_id is null then
    return; -- career row not present yet; nothing to attach to
  end if;

  if not exists (select 1 from public.resources where career_id = v_career_id) then
    insert into public.resources
      (title, url, provider, resource_type, cost, difficulty, description, tags, skill, career_id, category, duration_minutes, offers_certificate)
    values
      ('Build with Claude (Anthropic Docs)', 'https://docs.anthropic.com/en/docs/intro', 'Anthropic', 'documentation', 'free', 'beginner',
       'Anthropic''s official guide to building apps and tools with Claude.', array['ai','claude','apis'], 'Building with Claude',
       v_career_id, 'AI', 240, false),
      ('Learn Prompting', 'https://learnprompting.org/', 'Learn Prompting', 'course', 'free', 'beginner',
       'A free, practical course on prompt engineering from the basics up.', array['ai','prompting'], 'Prompt engineering',
       v_career_id, 'AI', 600, false),
      ('ChatGPT Prompt Engineering for Developers', 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/', 'DeepLearning.AI', 'course', 'free', 'beginner',
       'A free short course on writing effective prompts to build with LLMs.', array['ai','prompting','llm'], 'Prompt engineering',
       v_career_id, 'AI', 90, false),
      ('Bubble Academy', 'https://bubble.io/academy', 'Bubble', 'course', 'freemium', 'beginner',
       'Learn to build real web apps with no code, visually.', array['no-code','apps'], 'No-code building',
       v_career_id, 'AI', 480, false);
  end if;
end $$;
