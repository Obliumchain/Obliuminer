-- Insert default boosters
insert into public.boosters (name, description, type, multiplier_value, duration_hours, price_sol) values
  ('2x Multiplier', 'Double your mining points for 24 hours', 'multiplier', 2, 24, 0.07),
  ('4x Multiplier', 'Quadruple your mining points for 12 hours', 'multiplier', 4, 12, 0.07),
  ('Auto-Claim (24h)', 'Automatically claim points every 4 hours', 'auto_claim', 1, 24, 0.07),
  ('Auto-Claim (7d)', 'Premium 7-day auto-claim boost', 'auto_claim', 1, 168, 0.07),
  ('Premium Mining', 'Unlock premium mining features for 24 hours', 'premium_mining', 1, 24, 0.07)
on conflict do nothing;
