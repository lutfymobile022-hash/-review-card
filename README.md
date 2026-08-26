# Review Card

Next.js app for managing six-character review cards.

Features:
- six-character card lookup
- activation with business name, Google Review URL, and 4-digit PIN
- PIN-gated management
- active/inactive toggle
- edit and reset
- public `/r/CODE` route that redirects active cards to their Google Review URL
- QR generated for each card URL

Required environment variables:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
