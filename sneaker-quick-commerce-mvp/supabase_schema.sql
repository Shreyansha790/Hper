-- 1. Create Products table
CREATE TABLE IF NOT EXISTS "Products" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "description" TEXT,
    "price" NUMERIC NOT NULL,
    "originalPrice" NUMERIC,
    "images" JSONB,
    "category" TEXT,
    "colorway" TEXT,
    "sizes" JSONB,
    "tags" TEXT[],
    "featured" BOOLEAN DEFAULT false,
    "rating" NUMERIC DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Populate Products with default catalog data
INSERT INTO "Products" ("id", "name", "brand", "model", "description", "price", "originalPrice", "images", "category", "colorway", "sizes", "tags", "featured", "rating", "reviewCount")
VALUES 
(
  'prod-001', 
  'Nike Air Phantom X1', 
  'Nike', 
  'Nike Air Phantom X1', 
  'The Air Phantom X1 reimagines performance footwear for the streets. Featuring full-length Air cushioning, a premium leather upper, and an exclusive colorway developed with Bangalore street artists. Limited production run — once they''re gone, they''re gone.', 
  3299, 
  4599, 
  '["/images/sneaker-1.jpg", "/images/hero-sneaker.jpg"]'::jsonb, 
  'lifestyle', 
  'White / Volt Gold', 
  '[{"size": "6", "sku": "APX1-WHT-6"}, {"size": "7", "sku": "APX1-WHT-7"}, {"size": "8", "sku": "APX1-WHT-8"}, {"size": "9", "sku": "APX1-WHT-9"}, {"size": "10", "sku": "APX1-WHT-10"}, {"size": "11", "sku": "APX1-WHT-11"}, {"size": "12", "sku": "APX1-WHT-12"}]'::jsonb, 
  ARRAY['featured', 'new', 'bestseller', 'boutique-pick'], 
  true, 
  4.8, 
  342
),
(
  'prod-002', 
  'Jordan Retro High OG', 
  'Jordan', 
  'Jordan Retro High OG', 
  'The Jordan Retro High OG channels a generation-defining silhouette with refined modern construction. Tumbled leather upper, encapsulated Air-style cushioning, and iconic wing-inspired detailing deliver timeless courtside energy.', 
  3999, 
  4599, 
  '["/images/sneaker-2.jpg", "/images/hero-sneaker.jpg"]'::jsonb, 
  'basketball', 
  'Black / Fire Red', 
  '[{"size": "7", "sku": "JRH-BLK-7"}, {"size": "8", "sku": "JRH-BLK-8"}, {"size": "9", "sku": "JRH-BLK-9"}, {"size": "10", "sku": "JRH-BLK-10"}, {"size": "11", "sku": "JRH-BLK-11"}]'::jsonb, 
  ARRAY['featured', 'limited', 'editors-choice'], 
  true, 
  4.9, 
  891
),
(
  'prod-003', 
  'Yeezy Boost 350', 
  'Yeezy', 
  'Yeezy Boost 350', 
  'The Yeezy Boost 350 channels the iconic look with premium alternative craftsmanship. Built with a flexible knit upper and responsive comfort sole, it offers all-day wearability in an Onyx palette that pairs effortlessly with every fit.', 
  4599, 
  5999, 
  '["/images/sneaker-3.jpg", "/images/hero-sneaker.jpg"]'::jsonb, 
  'lifestyle', 
  'Onyx / Cream', 
  '[{"size": "6", "sku": "YZ350-ONX-6"}, {"size": "7", "sku": "YZ350-ONX-7"}, {"size": "8", "sku": "YZ350-ONX-8"}, {"size": "9", "sku": "YZ350-ONX-9"}, {"size": "10", "sku": "YZ350-ONX-10"}, {"size": "11", "sku": "YZ350-ONX-11"}]'::jsonb, 
  ARRAY['featured', 'premium', 'boutique-pick'], 
  true, 
  4.7, 
  567
),
(
  'prod-004', 
  '990v6 Grey Day', 
  'New Balance', 
  '990v6', 
  'The 990 series is New Balance''s crown jewel — Made in USA craftsmanship meets modern performance. The 990v6 features a premium suede and mesh upper, ENCAP midsole technology, and that unmistakable silhouette that has stood the test of time.', 
  3599, 
  4299, 
  '["/images/sneaker-4.jpg"]'::jsonb, 
  'running', 
  'Grey / Navy', 
  '[{"size": "7", "sku": "NB990-GRY-7"}, {"size": "8", "sku": "NB990-GRY-8"}, {"size": "9", "sku": "NB990-GRY-9"}, {"size": "10", "sku": "NB990-GRY-10"}, {"size": "11", "sku": "NB990-GRY-11"}, {"size": "12", "sku": "NB990-GRY-12"}]'::jsonb, 
  ARRAY['new', 'running'], 
  false, 
  4.6, 
  234
),
(
  'prod-005', 
  'Dunk Low Pro SB', 
  'Nike', 
  'Dunk Low Pro SB', 
  'Born on the skate parks of California, the Dunk Low Pro SB brought performance and street style together. Featuring Zoom Air cushioning, premium suede toe overlay, and that unmistakable chunky outsole. The University Blue colorway is a certified grail.', 
  2999, 
  3899, 
  '["/images/sneaker-5.jpg"]'::jsonb, 
  'skateboarding', 
  'University Blue / White', 
  '[{"size": "6", "sku": "DNKL-UBL-6"}, {"size": "7", "sku": "DNKL-UBL-7"}, {"size": "8", "sku": "DNKL-UBL-8"}, {"size": "9", "sku": "DNKL-UBL-9"}, {"size": "10", "sku": "DNKL-UBL-10"}]'::jsonb, 
  ARRAY['bestseller', 'skate'], 
  false, 
  4.8, 
  1203
),
(
  'prod-006', 
  'Air Force 1 Luxe', 
  'Nike', 
  'Air Force 1 Luxe', 
  'The AF1 — the shoe that started a revolution. The Luxe edition elevates the classic with premium tumbled leather, a cushioned insole for all-day comfort, and that iconic Air cushioning unit. Triple white. Timeless.', 
  4199, 
  4499, 
  '["/images/sneaker-6.jpg"]'::jsonb, 
  'lifestyle', 
  'Triple White', 
  '[{"size": "6", "sku": "AF1L-WHT-6"}, {"size": "7", "sku": "AF1L-WHT-7"}, {"size": "8", "sku": "AF1L-WHT-8"}, {"size": "9", "sku": "AF1L-WHT-9"}, {"size": "10", "sku": "AF1L-WHT-10"}, {"size": "11", "sku": "AF1L-WHT-11"}, {"size": "12", "sku": "AF1L-WHT-12"}]'::jsonb, 
  ARRAY['classic', 'lifestyle'], 
  false, 
  4.5, 
  2891
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Orders table
CREATE TABLE IF NOT EXISTS "Orders" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT,
    "store_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'placed',
    "payment_method" TEXT NOT NULL DEFAULT 'cod',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "subtotal" NUMERIC NOT NULL,
    "delivery_fee" NUMERIC NOT NULL DEFAULT 0,
    "discount" NUMERIC NOT NULL DEFAULT 0,
    "total" NUMERIC NOT NULL,
    "estimated_delivery" TIMESTAMPTZ,
    "rider_name" TEXT,
    "address" JSONB,
    "timeline" JSONB,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create OrderItems table
CREATE TABLE IF NOT EXISTS "OrderItems" (
    "id" TEXT PRIMARY KEY,
    "order_id" TEXT REFERENCES "Orders"("id") ON DELETE CASCADE,
    "product_id" TEXT REFERENCES "Products"("id") ON DELETE SET NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" NUMERIC NOT NULL,
    "store_id" TEXT
);
