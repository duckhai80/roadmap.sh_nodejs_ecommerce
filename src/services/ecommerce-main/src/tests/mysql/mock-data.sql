-- Create table
CREATE TABLE test_table (
  id INT NOT NULL,
  name VARCHAR(50) DEFAULT NULL,
  age INT DEFAULT NULL,
  address VARCHAR(50) DEFAULT NULL,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create procedure
CREATE DEFINER=`duckhai80`@`%` PROCEDURE `insert_data`()
BEGIN
  DECLARE max_id INT DEFAULT 1000000;
  DECLARE i INT DEFAULT 1;

  WHILE i <= max_id DO
    INSERT INTO test_table (id, name, age, address)
    VALUES (i, CONCAT('Name', i), i % 100, CONCAT('Address', i));
    SET i = i + 1;
  END WHILE;  
END

CALL insert_data();

-- Create table and use partition
CREATE TABLE orders (
  id INT,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2),

  PRIMARY KEY (id, order_date)
)

PARTITION BY RANGE COLUMNS (order_date) (
  PARTITION p0 VALUES LESS THAN ('2022-01-01'),
  PARTITION p1 VALUES LESS THAN ('2023-01-01'),
  PARTITION p2 VALUES LESS THAN ('2024-01-01'),
  PARTITION p3 VALUES LESS THAN ('2025-01-01'),
  PARTITION p4 VALUES LESS THAN ('2026-01-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);

EXPLAIN SELECT * FROM orders;

INSERT INTO orders (id, order_date, total_amount) VALUES (1, '2021-06-07', 299.99);
INSERT INTO orders (id, order_date, total_amount) VALUES (2, '2022-06-07', 399.99);
INSERT INTO orders (id, order_date, total_amount) VALUES (3, '2023-06-07', 499.99);
INSERT INTO orders (id, order_date, total_amount) VALUES (4, '2024-06-07', 599.99);
INSERT INTO orders (id, order_date, total_amount) VALUES (5, '2024-06-07', 599.99);
INSERT INTO orders (id, order_date, total_amount) VALUES (6, '2025-06-07', 599.99);
INSERT INTO orders (id, order_date, total_amount) VALUES (7, '2026-06-07', 599.99);

SELECT * FROM orders PARTITION (p2);