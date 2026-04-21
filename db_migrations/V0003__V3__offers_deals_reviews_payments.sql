CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  seller_id INT NOT NULL REFERENCES users(id),
  game_id INT NOT NULL REFERENCES games(id),
  category_id INT REFERENCES offer_categories(id),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  min_quantity INT NOT NULL DEFAULT 1,
  max_quantity INT NOT NULL DEFAULT 1,
  instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  deals_count INT NOT NULL DEFAULT 0,
  views_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  offer_id INT NOT NULL REFERENCES offers(id),
  buyer_id INT NOT NULL REFERENCES users(id),
  seller_id INT NOT NULL REFERENCES users(id),
  quantity INT NOT NULL DEFAULT 1,
  price_per_unit NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL DEFAULT 0,
  seller_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending_payment',
  payment_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  dispute_reason TEXT,
  buyer_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  deal_id INT NOT NULL REFERENCES deals(id),
  reviewer_id INT NOT NULL REFERENCES users(id),
  seller_id INT NOT NULL REFERENCES users(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  deal_id INT NOT NULL REFERENCES deals(id),
  user_id INT NOT NULL REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL,
  provider VARCHAR(30) NOT NULL DEFAULT 'robokassa',
  provider_invoice_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  test_mode BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offers_game_id ON offers(game_id);
CREATE INDEX idx_offers_seller_id ON offers(seller_id);
CREATE INDEX idx_offers_is_active ON offers(is_active);
CREATE INDEX idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX idx_deals_seller_id ON deals(seller_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);