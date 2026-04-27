CREATE PROCEDURE `create_table_auto_month`()
BEGIN
    -- Save next month value
    DECLARE next_month VARCHAR(20);
    -- Define new table name
    DECLARE table_name VARCHAR(20);
    -- Define new table prefix
    DECLARE table_prefix VARCHAR(20);
    -- SQL statement for creating a table
    DECLARE create_table_sql VARCHAR(5210);
    -- After executing the SQL statement to create the table, get the number of tables
    DECLARE table_count INT;

  -- Get the date of the next month and assign it to the next_month variable
  SELECT SUBSTR(REPLACE(DATE_ADD(CURDATE(), INTERVAL 1 MONTH),'-', ''),1, 6) 
  INTO @next_month;

  -- Set the value of the table prefix variable to this
  SET @table_prefix = 'orders_';

  -- Determine the table name = table prefix + month, that is orders_202604, orders_202605
  SET @table_name = CONCAT(@table_prefix, @next_month);

  -- Determine the SQL statement to create the table
  SET @create_table_sql = CONCAT("CREATE TABLE IF NOT EXISTS ", @table_name,
    " (
      order_id INT, -- order id
      order_date DATE NOT NULL,
      total_amount DECIMAL(10, 2),
      PRIMARY KEY (order_id, order_date)
    )"
  );
 
  -- Use the PREPARE keyword to create the SQL statement to be prepared for execution
  PREPARE create_stmt FROM @create_table_sql;
  -- Use the EXECUTE keyword to execute the SQL statement that has been prepared above
  EXECUTE create_stmt;
  -- Deallocate the SQL statement that was created before (reduce memory usage)
  DEALLOCATE PREPARE create_stmt;

  -- After executing the SQL statement to create the table, query the number of tables and save it to the table_count variable.
  SELECT
    COUNT(1) INTO @table_count
  FROM
    information_schema.`TABLES`
  WHERE TABLE_NAME = @table_name;
 
  -- Check if the corresponding table already exists
  SELECT @table_count 'table_count';

END