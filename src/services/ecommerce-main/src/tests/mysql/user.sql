CREATE TABLE users (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
  email VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
  address VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
  age INT DEFAULT 0,
  status INT DEFAULT 0,
  
  PRIMARY KEY (id),
  KEY idx_email_name_age (email, name, age),
  KEY idx_status (status)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO users (id, name, email, address, age, status) VALUES 
(1, 'messi', 'messi@gmail.com', 'address 1', 37, 1);
INSERT INTO users (id, name, email, address, age, status) VALUES 
(2, 'ronaldo', 'ronaldo@gmail.com', 'address 2', 40, 0);
INSERT INTO users (id, name, email, address, age, status) VALUES 
(3, 'duckhai', 'duckhai@gmail.com', 'address 3', 26, 1);

ALTER TABLE users AUTO_INCREMENT=4;

SELECT AUTO_INCREMENT 
FROM information_schema.tables 
WHERE table_name = 'users' AND table_schema = 'ecommerce_dev';


EXPLAIN SELECT * FROM users WHERE id = 1;

-- Use range index scan with index idx_email_name_age
EXPLAIN SELECT * FROM users WHERE email = 'duckhai@gmail.com';
EXPLAIN SELECT * FROM users WHERE email = 'duckhai@gmail.com' AND age = '26';
EXPLAIN SELECT * FROM users WHERE email = 'duckhai@gmail.com' AND name = 'duckhai';
EXPLAIN SELECT * FROM users WHERE email = 'duckhai@gmail.com' AND age = '26' AND name = 'duckhai';

-- Use full index scan with index idx_email_name_age
EXPLAIN SELECT age FROM users WHERE name = 'duckhai';

-- Cannot use index because the expression is not in the correct order
EXPLAIN SELECT * FROM users WHERE id + 1 = 2;

-- Cannot use index because LIKE with left-side wildcard
EXPLAIN SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Cannot use index because status = 1 has bigger ratio than status = 0. But if use status = 0, then it can use index.
EXPLAIN SELECT * FROM users WHERE id = 3 OR status = 1;
EXPLAIN SELECT * FROM users WHERE id = 3 OR status = 0;
EXPLAIN SELECT * FROM users WHERE id = 1 OR status = 0 OR address = 'address 1';