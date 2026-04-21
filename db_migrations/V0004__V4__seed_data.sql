INSERT INTO games (slug, name, emoji, color_from, color_to, description) VALUES
  ('roblox', 'Roblox', '🎮', 'from-red-400', 'to-orange-400', 'Robux, предметы, gamepass'),
  ('standoff-2', 'Standoff 2', '🔫', 'from-yellow-400', 'to-orange-500', 'Золото, скины, стикеры'),
  ('cs2', 'CS2', '🎯', 'from-orange-400', 'to-red-500', 'Скины, кейсы, Faceit'),
  ('mobile-legends', 'Mobile Legends', '⚡', 'from-blue-400', 'to-cyan-400', 'Алмазы, Starlight, скины'),
  ('apex-legends', 'Apex Legends', '🦊', 'from-red-500', 'to-pink-500', 'Монеты, скины, Drops'),
  ('minecraft', 'Minecraft', '⛏️', 'from-green-400', 'to-emerald-500', 'Аккаунты, читы, моды'),
  ('fortnite', 'Fortnite', '🌪️', 'from-purple-400', 'to-violet-500', 'V-Bucks, скины, аккаунты'),
  ('valorant', 'Valorant', '💎', 'from-rose-400', 'to-red-500', 'VP, скины, аккаунты');

INSERT INTO offer_categories (name, slug) VALUES
  ('Валюта', 'currency'),
  ('Предметы', 'items'),
  ('Услуги', 'services'),
  ('Аккаунты', 'accounts');